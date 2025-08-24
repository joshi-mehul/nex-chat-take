// hooks/useChat.ts
import { useCallback } from "react";
import {
  useClearMessages,
  useError,
  useIsLoading,
  useMessages,
  useSendMessage,
  useSetError,
} from "@store/chatStore";

export const useChat = () => {
  const messages = useMessages();
  const isLoading = useIsLoading();
  const error = useError();
  const sendMessage = useSendMessage();
  const clearMessages = useClearMessages();
  const setError = useSetError();

  const handleSendMessage = useCallback(
    async (content: string) => {
      await sendMessage(content);
    },
    [sendMessage],
  );

  const handleClearChat = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  const handleClearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    messages,
    isLoading,
    error,
    sendMessage: handleSendMessage,
    clearChat: handleClearChat,
    clearError: handleClearError,
  };
};
