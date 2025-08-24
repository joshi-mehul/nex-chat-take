import type { ChatMode } from "@types/flow";
import React, { useState } from "react";

interface ModeCardProps {
  mode: ChatMode;
  onSelect: (mode: ChatMode) => void;
}

export const ModeCard: React.FC<ModeCardProps> = ({ mode, onSelect }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = () => {
    console.log("ModeCard clicked:", mode);
    onSelect(mode);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Handle Enter and Space key presses for keyboard navigation
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-6 cursor-pointer 
        transition-all duration-200 border-2
        hover:shadow-lg hover:scale-105 hover:border-blue-400
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50
        ${isFocused ? "border-blue-500 shadow-lg" : "border-gray-200"}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Select ${mode.title} mode: ${mode.description}`}
      aria-describedby={`mode-${mode.id}-description`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="flex items-center mb-3">
        <span
          className="text-3xl mr-3 select-none"
          role="img"
          aria-label={`${mode.title} icon`}
          aria-hidden="false"
        >
          {mode.icon}
        </span>
        <h3
          className="text-xl font-semibold text-gray-800"
          id={`mode-${mode.id}-title`}
        >
          {mode.title}
        </h3>
      </div>
      <p
        className="text-gray-600 text-sm leading-relaxed"
        id={`mode-${mode.id}-description`}
      >
        {mode.description}
      </p>

      {/* Screen reader only content for additional context */}
      <span className="sr-only">
        Press Enter or Space to select this chat mode
      </span>
    </div>
  );
};
