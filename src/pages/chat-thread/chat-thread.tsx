

import { CanvasStage } from "@components/canvas";
import ChatApp from "@components/chat-app/chat-app";
import { ColorLegend } from "@components/common";
import { KeyboardShortcutsHelp, ZoomControls } from "@components/controls";
import { PropertiesPanel, Toolbar } from "@components/panels";
import Announcer from "@components/panels/announcer/announcer";
import { ThemeSettings } from "@components/theme-settings";
import { useChat } from "@hooks/useChat";
import { Bot } from "lucide-react";
import React from "react";

export const ChatThreadPage: React.FC = () => {
  const { clearChat } = useChat();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Chat Assistant</h1>
            <p className="text-sm opacity-90">Powered by AI Technology</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSettings />
          <button
            onClick={clearChat}
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-medium transition-all duration-200"
          >
            Clear Chat
          </button>
        </div>
      </div>
      {/* Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: ChatApp */}
        <div className="h-full w-full max-w-[40%] min-w-[350px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
          <ChatApp />
        </div>
        {/* Right: Remaining App */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Toolbar />
          <div className="flex-1 flex overflow-hidden h-full">
            <main
              className="flex-1 flex flex-col focus:outline-none"
              aria-label="Canvas region"
            >
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                <ColorLegend />
                <KeyboardShortcutsHelp />
              </div>
              <div className="h-full relative">
                <CanvasStage />
                <ZoomControls />
              </div>
            </main>
            <PropertiesPanel />
          </div>
          <Announcer />
        </div>
      </div>
    </div>
  );
};