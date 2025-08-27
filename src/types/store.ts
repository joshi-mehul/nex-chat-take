// src/types/store.ts

import type { ConversationResponse } from "./api";
import type { NodeType } from "./nodes";
import type { Connection, Pipeline } from "./pipeline";
import type { ValidationError } from "./validation";

// Conversation Store State
export interface ConversationState {
  conversations: Map<string, ConversationResponse>;
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  createConversation: (initialPrompt: string) => Promise<string>;
  addMessage: (conversationId: string, content: string) => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
  clearError: () => void;
  setCurrentConversation: (conversationId: string | null) => void;
}

// Pipeline Store State
export interface PipelineState {
  pipelines: Map<string, Pipeline>;
  currentPipelineId: string | null;
  selectedNodeId: string | null;
  selectedConnectionId: string | null;
  viewport: Viewport;
  isLoading: boolean;
  validationErrors: ValidationError[];
  nodeTypes: NodeType[];

  // Actions
  createPipeline: (data: Partial<Pipeline>) => Promise<string>;
  updatePipeline: (pipeline: Pipeline) => void;
  deletePipeline: (pipelineId: string) => Promise<void>;
  updateNode: (nodeId: string, updates: Partial<Node>) => Promise<void>;
  removeNode: (nodeId: string) => Promise<void>;
  addNode: (node: Omit<Node, "id">) => Promise<string>;
  updateConnection: (
    connectionId: string,
    updates: Partial<Connection>,
  ) => void;
  removeConnection: (connectionId: string) => void;
  addConnection: (connection: Omit<Connection, "id">) => string;
  validatePipeline: (pipelineId: string) => Promise<void>;
  testNodeConnection: (nodeId: string) => Promise<boolean>;
  setSelectedNode: (nodeId: string | null) => void;
  setSelectedConnection: (connectionId: string | null) => void;
  setViewport: (viewport: Partial<Viewport>) => void;
  loadNodeTypes: () => Promise<void>;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
  width?: number;
  height?: number;
}

// UI Store State
export interface UIState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  propertiesPanelOpen: boolean;
  notifications: Notification[];

  // Actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  togglePropertiesPanel: () => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: "primary" | "secondary";
}
