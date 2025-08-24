import MessageInput from "@components/message-input/message-input";
import { ModeCard } from "@components/mode-card/mode-card";
import { useChat } from "@hooks/useChat";
import { useClearMessages } from "@store/chatStore";
import { useModes } from "@store/modeStore";
import type { ChatMode } from "@types/flow";
import React from "react";
import { useNavigate } from "react-router-dom";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const modes = useModes();
  const clearMessages = useClearMessages();
  const { isLoading, sendMessage } = useChat();

  const handleNavigate = () => {
    navigate("/chat");
  };

  const handleModeSelect = async (mode: ChatMode) => {
    clearMessages();
    await sendMessage(mode.prompt, true);
    handleNavigate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Nexla Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose how you'd like to interact with me? Each mode is optimized
            for different types of conversations and tasks.
          </p>
        </div>

        <div>
          <div className="max-w-4xl mx-auto">
            <MessageInput
              onSendMessage={async (message) => {
                await sendMessage(message);
                handleNavigate();
              }}
              disabled={isLoading}
            />
          </div>
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
