// components/ChatApp.tsx
import MessageInput from "@components/conversations/message-input/message-input";
import MessageList from "@components/conversations/message-list/message-list";
import { useConversationStore } from "@store/conversationStore";
import { useWebSocket } from "@store/useWebSocket";
import { useEffect, useRef, type FC } from "react";
import { useParams } from "react-router-dom";

export const Prompt: FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    loadConversation,
    addMessage,
    getCurrentConversation,
    isProcessing,
    error,
  } = useConversationStore();

  // Set up WebSocket connection
  useWebSocket(conversationId || null);

  // Set up WebSocket connection
  useWebSocket(conversationId || null);

  const conversation = getCurrentConversation();

  useEffect(() => {
    if (conversationId && !conversation) {
      loadConversation(conversationId);
    }
  }, [conversationId, conversation, loadConversation]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !conversationId || isProcessing) return;

    const messageContent = message;

    try {
      await addMessage(conversationId, messageContent);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 scrollbar-thin">
        <div className="max-w-4xl mx-auto">
          <MessageList
            messages={conversation?.messages ?? []}
            isLoading={isProcessing}
            error={error}
          />
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};
