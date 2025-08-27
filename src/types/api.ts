import type { Pipeline } from "./pipeline";

export interface SessionResponse {
  sessionId: string;
  userId?: string;
  preferences: {
    theme: "light" | "dark";
    language: string;
  };
  createdAt: string;
  expiresAt: string;
}

// Conversation Types
export interface ConversationResponse {
  id: string;
  sessionId: string;
  messages: Message[];
  pipelineId?: string;
  status: "active" | "completed" | "error";
  createdAt: string;
  updatedAt: string;
}

// AI Processing Types
export interface AIParseResponse {
  pipeline: Pipeline;
  confidence: number;
  clarificationNeeded: boolean;
  questions?: ClarificationQuestion[];
  suggestions?: string[];
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  type: "text" | "select" | "multiselect" | "url";
  options?: string[];
  required: boolean;
}
