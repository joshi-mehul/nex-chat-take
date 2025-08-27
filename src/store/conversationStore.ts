import { conversationAPI } from "@services/apiClient";
import { getOrCreateSessionId } from "@utils/session";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { usePipelineStore } from "./pipelineStore";

export interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: string;
  metadata?: {
    clarificationQuestions?: Array<{
      id: string;
      question: string;
      type: string;
      options?: string[];
      required: boolean;
    }>;
    suggestedActions?: string[];
  };
}

export interface Conversation {
  id: string;
  sessionId: string;
  messages: Message[];
  pipelineId?: string;
  status: "active" | "completed" | "error";
  createdAt: string;
  updatedAt: string;
}

export interface ConversationState {
  conversations: Map<string, Conversation>;
  currentConversationId: string | null;
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;

  // Actions
  createConversation: (initialPrompt?: string) => Promise<string>;
  loadConversation: (conversationId: string) => Promise<void>;
  addMessage: (conversationId: string, content: string) => Promise<void>;
  setCurrentConversation: (conversationId: string | null) => void;
  clearError: () => void;
  getCurrentConversation: () => Conversation | null;
}

export const useConversationStore = create<ConversationState>()(
  subscribeWithSelector((set, get) => ({
    conversations: new Map(),
    currentConversationId: null,
    isLoading: false,
    isProcessing: false,
    error: null,

    createConversation: async (initialPrompt?: string) => {
      set({ isLoading: true, error: null });

      try {
        const sessionId = getOrCreateSessionId();
        const conversation = await conversationAPI.createConversation(
          initialPrompt || "",
          sessionId,
        );

        const { conversations } = get();
        conversations.set(conversation.id, conversation);

        set({
          conversations: new Map(conversations),
          currentConversationId: conversation.id,
          isLoading: false,
        });

        return conversation.id;
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to create conversation",
          isLoading: false,
        });
        throw error;
      }
    },

    loadConversation: async (conversationId: string) => {
      set({ isLoading: true, error: null });

      try {
        const conversation =
          await conversationAPI.getConversation(conversationId);
        const { conversations } = get();
        conversations.set(conversationId, conversation);

        set({
          conversations: new Map(conversations),
          currentConversationId: conversationId,
          isLoading: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to load conversation",
          isLoading: false,
        });
        throw error;
      }
    },

    addMessage: async (conversationId: string, content: string) => {
      set({ isProcessing: true, error: null });

      try {
        // Add user message optimistically
        const { conversations } = get();
        const conversation = conversations.get(conversationId);

        if (conversation) {
          const userMessage: Message = {
            id: `temp-${Date.now()}`,
            content,
            type: "user",
            timestamp: new Date().toISOString(),
          };

          conversation.messages.push(userMessage);
          conversations.set(conversationId, { ...conversation });
          set({ conversations: new Map(conversations) });
        }

        // Send message to API
        const aiMessage = await conversationAPI.addMessage(
          conversationId,
          content,
        );

        // Update with AI response
        if (conversation) {
          // Remove temp user message and add both user and AI messages
          conversation.messages = conversation.messages.filter(
            (m) => !m.id.startsWith("temp-"),
          );
          conversation.messages.push(
            {
              id: `user-${Date.now()}`,
              content,
              type: "user",
              timestamp: new Date().toISOString(),
            },
            aiMessage,
          );

          conversations.set(conversationId, { ...conversation });
          set({
            conversations: new Map(conversations),
            isProcessing: false,
          });
        }
        try {
          console.log(
            "🚀 Attempting to create pipeline from message:",
            content,
          );
          const pipelineId = await usePipelineStore
            .getState()
            .createPipelineFromIntent(content, conversationId);

          if (pipelineId && conversation) {
            // Link pipeline to conversation
            conversation.pipelineId = pipelineId;
            console.log("🔗 Pipeline linked to conversation:", pipelineId);
          }
        } catch (pipelineError) {
          console.warn(
            "⚠️ Pipeline creation failed, continuing with chat:",
            pipelineError,
          );
        }
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to send message",
          isProcessing: false,
        });
        throw error;
      }
    },

    setCurrentConversation: (conversationId: string | null) => {
      set({ currentConversationId: conversationId });
    },

    clearError: () => {
      set({ error: null });
    },

    getCurrentConversation: () => {
      const { conversations, currentConversationId } = get();
      return currentConversationId
        ? conversations.get(currentConversationId) || null
        : null;
    },
  })),
);
