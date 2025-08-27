// src/hooks/useSession.ts
import { useState, useEffect } from "react";
import { sessionManager, type UserPreferences } from "@utils/sessionManager";

export interface UseSessionReturn {
  sessionId: string | null;
  isInitialized: boolean;
  preferences: UserPreferences;
  updatePreferences: (preferences: UserPreferences) => void;
  destroySession: () => Promise<void>;
}

export const useSession = (): UseSessionReturn => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [preferences, setPreferences] = useState(
    sessionManager.getPreferences(),
  );

  useEffect(() => {
    const initSession = async () => {
      try {
        const sessionData = await sessionManager.initializeSession();
        setSessionId(sessionData.sessionId);
        setPreferences(sessionData.preferences);
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize session:", error);
        setIsInitialized(true);
      }
    };

    initSession();

    // Listen for storage changes (e.g., session cleared in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "sessionId") {
        setSessionId(e.newValue);
      } else if (e.key === "userPreferences" && e.newValue) {
        try {
          setPreferences(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Error parsing preferences from storage event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const updatePreferences = (newPreferences: UserPreferences) => {
    sessionManager.savePreferences(newPreferences);
    setPreferences(newPreferences);
  };

  const destroySession = async () => {
    await sessionManager.destroySession();
    setSessionId(null);
  };

  return {
    sessionId,
    isInitialized,
    preferences,
    updatePreferences,
    destroySession,
  };
};
