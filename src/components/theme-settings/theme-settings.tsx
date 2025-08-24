// components/ThemeSettings.tsx
import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@hooks/useTheme";

export const ThemeSettings: React.FC = () => {
  const { mode, getButtonClasses, toggleMode } = useTheme();

  return (
    <>
      <button
        onClick={() => toggleMode()}
        className={getButtonClasses("ghost")}
        aria-label="Theme settings"
      >
        {mode === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </>
  );
};
