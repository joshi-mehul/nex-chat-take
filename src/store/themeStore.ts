// store/themeStore.ts
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";
export type ThemeColor = "blue" | "green" | "purple" | "red" | "orange";

interface ThemeState {
  mode: ThemeMode;
  color: ThemeColor;
  fontSize: "small" | "medium" | "large";
  isDark: boolean;
}

interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export type ThemeStore = ThemeState & ThemeActions;

const getSystemTheme = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const calculateIsDark = (mode: ThemeMode): boolean => {
  if (mode === "system") return getSystemTheme();
  return mode === "dark";
};

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set, get) => ({
        mode: "system",
        color: "blue",
        fontSize: "medium",
        isDark: getSystemTheme(),

        setMode: (mode: ThemeMode) => {
          const isDark = calculateIsDark(mode);
          set({ mode, isDark });

          // Update document class
          if (typeof window !== "undefined") {
            const root = window.document.documentElement;
            if (isDark) {
              root.classList.add("dark");
            } else {
              root.classList.remove("dark");
            }
          }
        },

        toggleMode: () => {
          const { mode } = get();
          const newMode: ThemeMode = mode === "light" ? "dark" : "light";
          get().setMode(newMode);
        },
      }),
      {
        name: "theme-storage",
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Apply theme on hydration
            const isDark = calculateIsDark(state.mode);
            state.isDark = isDark;

            if (typeof window !== "undefined") {
              const root = window.document.documentElement;
              if (isDark) {
                root.classList.add("dark");
              } else {
                root.classList.remove("dark");
              }
              root.setAttribute("data-theme-color", state.color);

              const sizeMap = {
                small: "14px",
                medium: "16px",
                large: "18px",
              };
              root.style.fontSize = sizeMap[state.fontSize];
            }
          }
        },
      },
    ),
    { name: "theme-store" },
  ),
);

// Listen for system theme changes
if (typeof window !== "undefined") {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const { mode, setMode } = useThemeStore.getState();
      if (mode === "system") {
        setMode("system"); // This will recalculate isDark
      }
    });
}
