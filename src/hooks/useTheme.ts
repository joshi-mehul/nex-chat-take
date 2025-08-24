// hooks/useTheme.ts
import { useCallback } from "react";
import { useThemeStore } from "../store/themeStore";

export const useTheme = () => {
  const {
    mode,
    color,
    fontSize,
    isDark,
    setMode,
    setColor,
    setFontSize,
    toggleMode,
  } = useThemeStore();

  const getThemeClasses = useCallback(
    (baseClasses: string = "") => {
      const colorMap = {
        blue: "text-blue-600 dark:text-blue-400",
        green: "text-green-600 dark:text-green-400",
        purple: "text-purple-600 dark:text-purple-400",
        red: "text-red-600 dark:text-red-400",
        orange: "text-orange-600 dark:text-orange-400",
      };

      return `${baseClasses} ${colorMap[color]}`.trim();
    },
    [color],
  );

  const getButtonClasses = useCallback(
    (variant: "primary" | "secondary" | "ghost" = "primary") => {
      const baseClasses =
        "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

      const variantMap = {
        primary: {
          blue: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
          green:
            "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
          purple:
            "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
          red: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
          orange:
            "bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500",
        },
        secondary: {
          blue: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800",
          green:
            "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800",
          purple:
            "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800",
          red: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800",
          orange:
            "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800",
        },
        ghost: {
          blue: "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
          green:
            "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20",
          purple:
            "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20",
          red: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
          orange:
            "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20",
        },
      };

      return `${baseClasses} ${variantMap[variant][color]}`;
    },
    [color],
  );

  return {
    mode,
    color,
    fontSize,
    isDark,
    setMode,
    setColor,
    setFontSize,
    toggleMode,
    getThemeClasses,
    getButtonClasses,
  };
};
