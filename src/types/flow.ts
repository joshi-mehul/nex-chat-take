import type { ReactNode } from "react";

export type NodeKind = "source" | "transform" | "destination";
export type NodeStatus = "idle" | "running" | "success" | "error";

export type Vector2 = { x: number; y: number };

// Extensible node definition
export interface FlowNode<TExtras = Record<string, unknown>> {
  id: string;
  kind: NodeKind;
  label: string;
  position: Vector2; // Canvas coordinates
  size: { width: number; height: number };
  status?: NodeStatus;
  color?: string; // overrides default color per node
  icon?: string; // optional emoji or data-URL
  locked?: boolean; // prevents moves/edits
  hidden?: boolean;
  meta?: TExtras; // arbitrary extensible payload
  // future-proof:
  inputs?: string[]; // input port names
  outputs?: string[]; // output port names
}

export interface FlowEdge<TExtras = Record<string, unknown>> {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromPort?: string;
  toPort?: string;
  label?: string;
  dashed?: boolean;
  color?: string;
  meta?: TExtras;
}

export interface ViewportState {
  zoom: number; // 0.25..4
  offset: Vector2; // panning offset
}

export interface SelectionState {
  nodeIds: string[];
  edgeIds: string[];
  marquee?: { start: Vector2; end: Vector2 } | null;
}

export interface AnnounceMessage {
  id: number;
  text: string;
  politeness?: "polite" | "assertive";
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface ChatMode {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  prompt: string;
}

export interface ModeState {
  selectedMode: ChatMode | null;
  modes: ChatMode[];
  setSelectedMode: (mode: ChatMode | null) => void;
}
