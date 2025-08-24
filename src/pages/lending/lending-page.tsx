import { ModeCard } from "@components/mode-card/mode-card";
import { useClearMessages } from "@store/chatStore";
import { useModes, useSetSelectedMode } from "@store/modeStore";
import type { ChatMode } from "@types/flow";
import React from "react";
import { useNavigate } from "react-router-dom";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const modes = useModes();
  const setSelectedMode = useSetSelectedMode();
  const clearMessages = useClearMessages();

  const handleModeSelect = (mode: ChatMode) => {
    setSelectedMode(mode);
    clearMessages();
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            AI Chat Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose how you'd like to interact with our AI assistant. Each mode
            is optimized for different types of conversations and tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modes.map((mode) => (
            <ModeCard key={mode.id} mode={mode} onSelect={handleModeSelect} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Select a mode above to start your conversation
          </p>
        </div>
      </div>
    </div>
  );
};
