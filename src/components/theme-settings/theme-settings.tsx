// components/ThemeSettings.tsx
import React, { useState } from "react";
import { Settings, Sun, Moon, Monitor, Type, X } from "lucide-react";
import { useTheme } from "@hooks/useTheme";

export const ThemeSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    mode,
    color,
    fontSize,
    setMode,
    setColor,
    setFontSize,
    getButtonClasses,
  } = useTheme();

  const modeOptions = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  const colorOptions = [
    { value: "blue" as const, label: "Blue", class: "bg-blue-500" },
    { value: "green" as const, label: "Green", class: "bg-green-500" },
    { value: "purple" as const, label: "Purple", class: "bg-purple-500" },
    { value: "red" as const, label: "Red", class: "bg-red-500" },
    { value: "orange" as const, label: "Orange", class: "bg-orange-500" },
  ];

  const fontSizeOptions = [
    { value: "small" as const, label: "Small" },
    { value: "medium" as const, label: "Medium" },
    { value: "large" as const, label: "Large" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={getButtonClasses("ghost")}
        aria-label="Theme settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">Theme Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Theme Mode */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Theme Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {modeOptions.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setMode(value)}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                        ${
                          mode === value
                            ? "border-current " +
                              getButtonClasses("primary")
                                .split(" ")
                                .slice(-1)[0]
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Color Theme
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map(({ value, label, class: colorClass }) => (
                    <button
                      key={value}
                      onClick={() => setColor(value)}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                        ${
                          color === value
                            ? "border-current ring-2 ring-offset-2 ring-current"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                        }
                      `}
                    >
                      <div
                        className={`w-6 h-6 rounded-full ${colorClass} mb-1`}
                      />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Font Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {fontSizeOptions.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setFontSize(value)}
                      className={`
                        flex items-center justify-center p-3 rounded-lg border-2 transition-all
                        ${
                          fontSize === value
                            ? getButtonClasses("primary")
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }
                      `}
                    >
                      <Type className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
