// src/lib/session.ts
import { v4 as uuidv4 } from "uuid";

/**
 * Retrieves the current session ID from localStorage
 * Returns null if no session exists or if it's expired
 */
export function getSessionId(): string | null {
  try {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      return null;
    }

    // Check if session is expired
    const sessionExpiry = localStorage.getItem("sessionExpiry");
    if (sessionExpiry) {
      const expiryTime = new Date(sessionExpiry);
      const now = new Date();

      if (now > expiryTime) {
        clearSession();
        return null;
      }
    }

    return sessionId;
  } catch (error) {
    console.error("Error retrieving session ID:", error);
    return null;
  }
}

/**
 * Creates a new session ID and stores it in localStorage
 */
export function createSessionId(): string {
  const sessionId = uuidv4();
  const expiryTime = new Date();
  expiryTime.setHours(expiryTime.getHours() + 24); // 24-hour expiry

  try {
    localStorage.setItem("sessionId", sessionId);
    localStorage.setItem("sessionExpiry", expiryTime.toISOString());
    localStorage.setItem("sessionCreated", new Date().toISOString());

    return sessionId;
  } catch (error) {
    console.error("Error creating session ID:", error);
    throw new Error("Failed to create session");
  }
}

/**
 * Sets an existing session ID
 */
export function setSessionId(sessionId: string, expiresAt?: string): void {
  try {
    localStorage.setItem("sessionId", sessionId);

    if (expiresAt) {
      localStorage.setItem("sessionExpiry", expiresAt);
    } else {
      // Default 24-hour expiry
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 24);
      localStorage.setItem("sessionExpiry", expiryTime.toISOString());
    }

    localStorage.setItem("sessionCreated", new Date().toISOString());
  } catch (error) {
    console.error("Error setting session ID:", error);
    throw new Error("Failed to set session");
  }
}

/**
 * Gets or creates a session ID
 */
export function getOrCreateSessionId(): string {
  let sessionId = getSessionId();

  if (!sessionId) {
    sessionId = createSessionId();
  }

  return sessionId;
}

/**
 * Clears the current session
 */
export function clearSession(): void {
  try {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("sessionExpiry");
    localStorage.removeItem("sessionCreated");
    localStorage.removeItem("userPreferences");
  } catch (error) {
    console.error("Error clearing session:", error);
  }
}

/**
 * Checks if a session exists and is valid
 */
export function hasValidSession(): boolean {
  return getSessionId() !== null;
}

/**
 * Gets session metadata
 */
export function getSessionMetadata(): {
  sessionId: string | null;
  createdAt: string | null;
  expiresAt: string | null;
  isExpired: boolean;
} | null {
  try {
    const sessionId = localStorage.getItem("sessionId");
    const sessionCreated = localStorage.getItem("sessionCreated");
    const sessionExpiry = localStorage.getItem("sessionExpiry");

    if (!sessionId) {
      return null;
    }

    const isExpired = sessionExpiry
      ? new Date() > new Date(sessionExpiry)
      : false;

    return {
      sessionId,
      createdAt: sessionCreated,
      expiresAt: sessionExpiry,
      isExpired,
    };
  } catch (error) {
    console.error("Error getting session metadata:", error);
    return null;
  }
}
