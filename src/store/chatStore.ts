// store/chatStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Message } from "@types/flow";
import { sendMessageToAI } from "../services/aiService";

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentMode?: string;
}

interface ChatActions {
  sendMessage: (
    content: string,
    mode?: string,
    resolveImmediate?: boolean,
  ) => Promise<void>;
  clearMessages: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setCurrentMode: (mode: string) => void;
}

export type ChatStore = ChatState & ChatActions;

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  currentMode: undefined,
};

export const useChatStore = create<ChatStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      sendMessage: async (
        content: string,
        mode?: string,
        resolveImmediate: boolean = false,
      ) => {
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
            currentMode: mode || state.currentMode,
          }),
          false,
          "sendMessage/addUserMessage",
        );

        try {
          const aiResponse = await sendMessageToAI(
            content,
            mode || get().currentMode,
            resolveImmediate,
          );

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
              error: `Failed to get AI response. Please try again. ${error}`,
            },
            false,
            "sendMessage/error",
          );
        }
      },

      clearMessages: () => {
        set(
          { ...initialState, currentMode: get().currentMode },
          false,
          "clearMessages",
        );
      },

      setError: (error: string | null) => {
        set({ error }, false, "setError");
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading }, false, "setLoading");
      },

      setCurrentMode: (currentMode: string) => {
        set({ currentMode }, false, "setCurrentMode");
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
export const useCurrentMode = () => useChatStore((state) => state.currentMode);
export const useSetCurrentMode = () =>
  useChatStore((state) => state.setCurrentMode);
