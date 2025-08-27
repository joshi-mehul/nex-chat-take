// components/ThemeSettings.tsx
import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@hooks/useTheme";

export const ThemeToggle: React.FC = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <button onClick={() => toggleMode()} aria-label="Theme toggle">
      {mode === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};
