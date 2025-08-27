import type { Message, NodeStatus } from "./flow";
import type { Pipeline } from "./pipeline";
import type { ValidationResponse } from "./validation";

// WebSocket Event Base
export interface BaseWebSocketEvent {
  type: string;
  timestamp: string;
  conversationId: string;
}

export interface StatusUpdateEvent extends BaseWebSocketEvent {
  type: "node_status_update";
  nodeId: string;
  status: NodeStatus;
  message?: string;
  progress?: number;
}

export interface AIResponseEvent extends BaseWebSocketEvent {
  type: "ai_response";
  message: Message;
  pipelineUpdates?: Partial<Pipeline>;
  clarificationNeeded?: boolean;
}

export interface ValidationEvent extends BaseWebSocketEvent {
  type: "validation_result";
  pipelineId: string;
  result: ValidationResponse;
}

export interface ConnectionTestEvent extends BaseWebSocketEvent {
  type: "connection_test_result";
  nodeId: string;
  success: boolean;
  message?: string;
  metadata?: Record<string, any>;
}

export interface PipelineExecutionEvent extends BaseWebSocketEvent {
  type: "pipeline_execution";
  pipelineId: string;
  status: "started" | "completed" | "failed" | "cancelled";
  progress?: ExecutionProgress;
}

export interface ExecutionProgress {
  currentStep: number;
  totalSteps: number;
  currentNodeId?: string;
  recordsProcessed?: number;
  estimatedTimeRemaining?: number;
}

export type WebSocketEvent =
  | StatusUpdateEvent
  | AIResponseEvent
  | ValidationEvent
  | ConnectionTestEvent
  | PipelineExecutionEvent;
