import type { PredefinedPrompts } from "@types/flow";
import React, { useState } from "react";

interface PromptCardProps {
  prompt: PredefinedPrompts;
  onSelect: (prompts: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onSelect }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = () => {
    onSelect(prompt.prompt);
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
        bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/20 p-6 cursor-pointer 
        transition-all duration-200 border-2
        hover:shadow-lg hover:scale-105 hover:border-blue-400 dark:hover:border-blue-500
        focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 focus-within:ring-opacity-50
        ${
          isFocused
            ? "border-blue-500 dark:border-blue-400 shadow-lg dark:shadow-gray-900/30"
            : "border-gray-200 dark:border-gray-700"
        }
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Select ${prompt.title} mode: ${prompt.description}`}
      aria-describedby={`prompt-${prompt.id}-description`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="flex items-center mb-3">
        <span
          className="text-3xl mr-3 select-none"
          role="img"
          aria-label={`${prompt.title} icon`}
          aria-hidden="false"
        >
          {prompt.icon}
        </span>
        <h3
          className="text-xl font-semibold text-gray-800 dark:text-gray-200"
          id={`mode-${prompt.id}-title`}
        >
          {prompt.title}
        </h3>
      </div>
      <p
        className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
        id={`mode-${prompt.id}-description`}
      >
        {prompt.description}
      </p>

      {/* Screen reader only content for additional context */}
      <span className="sr-only">
        Press Enter or Space to select this chat mode
      </span>
    </div>
  );
};
