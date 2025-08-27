// src/lib/sessionManager.ts

import {
  clearSession,
  createSessionId,
  getSessionId,
  setSessionId,
} from "./session";

export interface UserPreferences {
  theme: "light" | "dark";
  language: string;
  timezone?: string;
}

export interface SessionData {
  sessionId: string;
  preferences: UserPreferences;
  lastActivity: string;
}

export class SessionManager {
  private static instance: SessionManager;
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.startSessionMonitoring();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Initialize session - gets existing or creates new session
   */
  async initializeSession(): Promise<SessionData> {
    let sessionId = getSessionId();

    if (!sessionId) {
      sessionId = createSessionId();

      // Make API call to initialize session on backend
      try {
        await this.createBackendSession(sessionId);
      } catch (error) {
        console.error("Failed to create backend session:", error);
      }
    }

    const preferences = this.getPreferences();
    this.updateLastActivity();

    return {
      sessionId,
      preferences,
      lastActivity: new Date().toISOString(),
    };
  }

  /**
   * Get user preferences from localStorage
   */
  getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem("userPreferences");
      [25];
      if (stored) {
        return JSON.parse(stored);
        [26];
      }
    } catch (error) {
      console.error("Error parsing user preferences:", error);
    }

    // Default preferences
    return {
      theme: "light",
      language: "en",
    };
  }

  /**
   * Save user preferences to localStorage
   */
  savePreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
      [25];
    } catch (error) {
      console.error("Error saving user preferences:", error);
    }
  }

  /**
   * Update last activity timestamp
   */
  updateLastActivity(): void {
    try {
      localStorage.setItem("lastActivity", new Date().toISOString());
      [25];
    } catch (error) {
      console.error("Error updating last activity:", error);
    }
  }

  /**
   * Check if session should be renewed based on activity
   */
  shouldRenewSession(): boolean {
    try {
      const lastActivity = localStorage.getItem("lastActivity");
      [25];
      if (!lastActivity) return true;

      const lastActivityTime = new Date(lastActivity);
      const now = new Date();
      const hoursSinceActivity =
        (now.getTime() - lastActivityTime.getTime()) / (1000 * 60 * 60);

      // Renew if more than 1 hour since last activity
      return hoursSinceActivity > 1;
    } catch (error) {
      console.error("Error checking session renewal:", error);
      return true;
    }
  }

  /**
   * Extend session expiry
   */
  extendSession(): void {
    const sessionId = getSessionId();
    if (sessionId) {
      const newExpiryTime = new Date();
      newExpiryTime.setHours(newExpiryTime.getHours() + 24);
      setSessionId(sessionId, newExpiryTime.toISOString());
      this.updateLastActivity();
    }
  }

  /**
   * Destroy current session
   */
  async destroySession(): Promise<void> {
    const sessionId = getSessionId();

    if (sessionId) {
      try {
        // Notify backend about session destruction
        await fetch(`${process.env.REACT_APP_API_URL}/api/auth/session`, {
          method: "DELETE",
          headers: {
            "X-Session-ID": sessionId,
          },
        });
      } catch (error) {
        console.error("Error destroying backend session:", error);
      }
    }

    clearSession();
    this.stopSessionMonitoring();
  }

  /**
   * Create session on backend
   */
  private async createBackendSession(sessionId: string): Promise<void> {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          preferences: this.getPreferences(),
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create backend session");
    }
  }

  /**
   * Start monitoring session for auto-renewal and cleanup
   */
  private startSessionMonitoring(): void {
    this.sessionCheckInterval = setInterval(
      () => {
        const sessionId = getSessionId();

        if (!sessionId) {
          return; // No session to monitor
        }

        if (this.shouldRenewSession()) {
          this.extendSession();
        }
      },
      5 * 60 * 1000,
    ); // Check every 5 minutes
  }

  /**
   * Stop session monitoring
   */
  private stopSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance();
