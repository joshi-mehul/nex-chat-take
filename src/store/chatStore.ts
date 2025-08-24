// store/chatStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Message } from "@components/chat-app/chat-app";
import { sendMessageToAI } from "@services/aiService";

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

interface ChatActions {
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

export const useChatStore = create<ChatStore>()(
  devtools(
    (set, _get) => ({
      ...initialState,

      sendMessage: async (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = {
          id: Date.now().toString(),
          content: content.trim(),
          role: "user",
          timestamp: new Date(),
        };

        // Add user message and set loading
        set(
          (state) => ({
            messages: [...state.messages, userMessage],
            isLoading: true,
            error: null,
          }),
          false,
          "sendMessage/addUserMessage",
        );

        try {
          const aiResponse = await sendMessageToAI(content);

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: aiResponse,
            role: "assistant",
            timestamp: new Date(),
          };

          set(
            (state) => ({
              messages: [...state.messages, assistantMessage],
              isLoading: false,
            }),
            false,
            "sendMessage/addAssistantMessage",
          );
        } catch (error) {
          set(
            {
              isLoading: false,
              error: "Failed to get AI response. Please try again.",
            },
            false,
            "sendMessage/error",
          );
        }
      },

      clearMessages: () => {
        set(initialState, false, "clearMessages");
      },

      setError: (error: string | null) => {
        set({ error }, false, "setError");
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading }, false, "setLoading");
      },
    }),
    {
      name: "chat-store",
    },
  ),
);

// Selectors for optimized re-renders
export const useMessages = () => useChatStore((state) => state.messages);
export const useIsLoading = () => useChatStore((state) => state.isLoading);
export const useError = () => useChatStore((state) => state.error);
export const useSendMessage = () => useChatStore((state) => state.sendMessage);
export const useSetError = () => useChatStore((state) => state.setError);
export const useSetLoading = () => useChatStore((state) => state.setLoading);
export const useClearMessages = () =>
  useChatStore((state) => state.clearMessages);
