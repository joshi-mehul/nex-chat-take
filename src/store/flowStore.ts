import { create } from "zustand";
import { produce } from "immer";
import type {
  AnnounceMessage,
  FlowEdge,
  FlowNode,
  NodeKind,
  SelectionState,
  Vector2,
  ViewportState,
} from "@types/flow";
import { appConfig } from "@config/config";
import { nextId } from "@utils/id";
import { clamp } from "@utils/geometry";
import { ZOOM } from "@constants/constants";

type FlowState = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport: ViewportState;
  selection: SelectionState;
  announcer: AnnounceMessage[];
  hoveredNodeId: string | null;
  connecting: { fromNodeId: string; cursor: Vector2 } | null;

  // actions
  addNode: (partial: Partial<FlowNode>) => string;
  updateNode: (id: string, patch: Partial<FlowNode>) => void;
  removeNodes: (ids: string[]) => void;

  addEdge: (partial: Partial<FlowEdge>) => string;
  removeEdges: (ids: string[]) => void;

  setViewport: (patch: Partial<ViewportState>) => void;
  setSelection: (sel: Partial<SelectionState>) => void;
  clearSelection: () => void;

  beginConnect: (fromNodeId: string, cursor: Vector2) => void;
  updateConnectingCursor: (cursor: Vector2) => void;
  completeConnect: (toNodeId: string) => void;
  cancelConnect: () => void;

  moveSelectedNodes: (delta: Vector2) => void;

  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;

  announce: (text: string, politeness?: "polite" | "assertive") => void;
};

const seedNodes = appConfig.seed.nodes as unknown as FlowNode[];
const seedEdges = appConfig.seed.edges as unknown as FlowEdge[];

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: seedNodes,
  edges: seedEdges,
  viewport: appConfig.initialViewport,
  selection: { nodeIds: [], edgeIds: [], marquee: null },
  announcer: [],
  hoveredNodeId: null,
  connecting: null,

  addNode: (partial) => {
    const id = partial.id ?? nextId("node");
    set(
      produce<FlowState>((draft) => {
        const node: FlowNode = {
          id,
          kind: (partial.kind as unknown as NodeKind) ?? "source",
          label: partial.label ?? "Untitled",
          position: partial.position ?? { x: 0, y: 0 },
          size: partial.size ?? { width: 160, height: 60 },
          status: partial.status ?? "idle",
          color: partial.color,
          icon: partial.icon,
          locked: partial.locked ?? false,
          hidden: partial.hidden ?? false,
          meta: partial.meta ?? {},
          inputs: partial.inputs ?? [],
          outputs: partial.outputs ?? [],
        };
        draft.nodes.push(node);
      }),
    );
    get().announce("Node added");
    return id;
  },

  updateNode: (id, patch) => {
    set(
      produce<FlowState>((draft) => {
        const n = draft.nodes.find((n) => n.id === id);
        if (!n) return;
        Object.assign(n, patch);
      }),
    );
  },

  removeNodes: (ids) => {
    set(
      produce<FlowState>((draft) => {
        draft.nodes = draft.nodes.filter((n) => !ids.includes(n.id));
        // Remove edges attached to removed nodes
        const removedNodeSet = new Set(ids);
        draft.edges = draft.edges.filter(
          (e) =>
            !removedNodeSet.has(e.fromNodeId) &&
            !removedNodeSet.has(e.toNodeId),
        );
        draft.selection.nodeIds = [];
      }),
    );
    get().announce("Node(s) removed");
  },

  addEdge: (partial) => {
    const id = partial.id ?? nextId("edge");
    set(
      produce<FlowState>((draft) => {
        const edge: FlowEdge = {
          id,
          fromNodeId: partial.fromNodeId!,
          toNodeId: partial.toNodeId!,
          fromPort: partial.fromPort,
          toPort: partial.toPort,
          label: partial.label,
          dashed: partial.dashed ?? false,
          color: partial.color,
          meta: partial.meta ?? {},
        };
        draft.edges.push(edge);
      }),
    );
    get().announce("Edge added");
    return id;
  },

  removeEdges: (ids) => {
    set(
      produce<FlowState>((draft) => {
        draft.edges = draft.edges.filter((e) => !ids.includes(e.id));
        draft.selection.edgeIds = draft.selection.edgeIds.filter(
          (id) => !ids.includes(id),
        );
      }),
    );
    get().announce("Edge(s) removed");
  },

  setViewport: (patch) => {
    set(
      produce<FlowState>((draft) => {
        draft.viewport = { ...draft.viewport, ...patch };
      }),
    );
  },

  setSelection: (sel) => {
    set(
      produce<FlowState>((draft) => {
        draft.selection = { ...draft.selection, ...sel };
      }),
    );
  },

  clearSelection: () => {
    set(
      produce<FlowState>((draft) => {
        draft.selection = { nodeIds: [], edgeIds: [], marquee: null };
      }),
    );
  },

  beginConnect: (fromNodeId, cursor) => {
    set(
      produce<FlowState>((draft) => {
        draft.connecting = { fromNodeId, cursor };
      }),
    );
  },

  updateConnectingCursor: (cursor) => {
    set(
      produce<FlowState>((draft) => {
        if (draft.connecting) draft.connecting.cursor = cursor;
      }),
    );
  },

  completeConnect: (toNodeId) => {
    const { connecting } = get();
    if (!connecting) return;
    const id = nextId("edge");
    set(
      produce<FlowState>((draft) => {
        draft.edges.push({
          id,
          fromNodeId: connecting.fromNodeId,
          toNodeId,
          label: undefined,
        });
        draft.connecting = null;
      }),
    );
    get().announce("Nodes connected");
  },

  cancelConnect: () => {
    set(
      produce<FlowState>((draft) => {
        draft.connecting = null;
      }),
    );
  },

  moveSelectedNodes: (delta) => {
    set(
      produce<FlowState>((draft) => {
        const setSel = new Set(draft.selection.nodeIds);
        draft.nodes.forEach((n) => {
          if (setSel.has(n.id) && !n.locked) {
            n.position.x += delta.x;
            n.position.y += delta.y;
          }
        });
      }),
    );
  },

  zoomIn: () => {
    const z = clamp(get().viewport.zoom + ZOOM.step, ZOOM.min, ZOOM.max);
    get().setViewport({ zoom: z });
  },

  zoomOut: () => {
    const z = clamp(get().viewport.zoom - ZOOM.step, ZOOM.min, ZOOM.max);
    get().setViewport({ zoom: z });
  },

  resetView: () => {
    get().setViewport({ zoom: 1, offset: { x: 0, y: 0 } });
  },

  announce: (text, politeness = "polite") => {
    const msg = { id: Date.now(), text, politeness };
    set(
      produce<FlowState>((draft) => {
        draft.announcer.push(msg);
      }),
    );
    // Auto-trim queue
    setTimeout(() => {
      set(
        produce<FlowState>((draft) => {
          draft.announcer = draft.announcer.filter((m) => m.id !== msg.id);
        }),
      );
    }, 1500);
  },
}));
