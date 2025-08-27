// src/stores/pipelineStore.ts
import { ZOOM } from "@constants/constants";
import { aiAPI, pipelineAPI } from "@services/apiClient";
import type { Vector2 } from "@types/flow";
import type { Node, Pipeline } from "@types/pipeline";
import { clamp } from "@utils/geometry";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type Viewport = {
  x: number;
  y: number;
  zoom: number;
};

export type Selection = {
  nodeIds: string[];
  edgeIds: string[];
  marquee: null;
};

interface PipelineState {
  pipelines: Map<string, Pipeline>;
  currentPipelineId: string | null;
  selectedNodeId: string | null;
  viewport: Viewport;
  isLoading: boolean;
  error: string | null;
  validationErrors: any[];
  selection: Selection;
  hoveredNodeId: string | null;

  // Actions
  createPipelineFromIntent: (
    naturalLanguage: string,
    conversationId: string,
  ) => Promise<string | null>;
  loadPipeline: (pipelineId: string) => Promise<void>;
  updateNode: (nodeId: string, updates: Partial<Node>) => Promise<void>;

  setCurrentPipeline: (pipelineId: string | null) => void;
  getCurrentPipeline: () => Pipeline | null;
  setViewport: (patch: Partial<Viewport>) => void;
  setSelection: (selection: Partial<Selection>) => void;
  clearSelection: () => void;
  resetView: () => void;
  zoomOut: () => void;
  zoomIn: () => void;
  moveSelectedNodes: (delta: Vector2) => void;
  // ... other actions
}

export const usePipelineStore = create<PipelineState>()(
  subscribeWithSelector((set, get) => ({
    pipelines: new Map(),
    currentPipelineId: null,
    selectedNodeId: null,
    viewport: { x: 0, y: 0, zoom: 1 },
    isLoading: false,
    error: null,
    validationErrors: [],
    selection: { nodeIds: [], edgeIds: [], marquee: null },
    hoveredNodeId: null,

    createPipelineFromIntent: async (
      naturalLanguage: string,
      conversationId: string,
    ) => {
      set({ isLoading: true, error: null });

      try {
        console.log("🤖 Parsing intent:", naturalLanguage);

        // Step 1: Parse the natural language intent
        const intentResult = await aiAPI.parseIntent(naturalLanguage, {
          conversationId,
        });
        console.log("🧠 Intent result:", intentResult);

        console.log(
          "intentResult.createdPipeline",
          intentResult.createdPipeline,
        );
        // Step 2: Check if a pipeline was created in the response
        if (intentResult.createdPipeline) {
          const pipeline = intentResult.createdPipeline;
          console.log("✅ Pipeline created from intent:", pipeline);

          const { pipelines } = get();
          pipelines.set(pipeline.id, pipeline);

          set({
            pipelines: new Map(pipelines),
            currentPipelineId: pipeline.id,
            isLoading: false,
          });

          return pipeline.id;
        }

        console.log(
          "intentResult.suggestedPipeline?.nodes.length > 0",
          intentResult.suggestedPipeline?.nodes.length > 0,
        );

        // Step 3: If no pipeline yet, create one from the blueprint
        if (intentResult.suggestedPipeline?.nodes.length > 0) {
          const pipelineData = {
            name: `Pipeline: ${naturalLanguage.substring(0, 50)}...`,
            description: `Auto-generated from: "${naturalLanguage}"`,
            conversationId,
            nodes: intentResult.suggestedPipeline.nodes.map(
              (nodeBlueprint: any, index: number) => ({
                id: nodeBlueprint.id,
                serviceId: nodeBlueprint.serviceId,
                instanceName: `${nodeBlueprint.role} ${index + 1}`,
                nodeType: nodeBlueprint.role,
                position: nodeBlueprint.position,
                status: "pending" as const,
                configuration: nodeBlueprint.configuration || {
                  connection: {},
                  operation: { type: nodeBlueprint.role, parameters: {} },
                },
              }),
            ),
            connections: intentResult.suggestedPipeline.connections,
            configuration: {
              errorHandling: {
                retryCount: 3,
                retryDelay: 3000,
                onFailure: "notify",
              },
              notifications: {
                onSuccess: true,
                onFailure: true,
              },
            },
          };

          console.log("🔨 Creating pipeline:", pipelineData);
          const createdPipeline =
            await pipelineAPI.createPipeline(pipelineData);
          console.log("✅ Pipeline created:", createdPipeline);

          const { pipelines } = get();
          pipelines.set(createdPipeline.id, createdPipeline);

          set({
            pipelines: new Map(pipelines),
            currentPipelineId: createdPipeline.id,
            isLoading: false,
          });

          return createdPipeline.id;
        }

        set({ isLoading: false });
        return null;
      } catch (error) {
        console.error("❌ Failed to create pipeline from intent:", error);
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to create pipeline",
          isLoading: false,
        });
        return null;
      }
    },

    updateNode: async (nodeId: string, updates: Partial<Node>) => {
      const { currentPipelineId } = get();
      if (!currentPipelineId) return;

      try {
        await pipelineAPI.updateNode(
          currentPipelineId,
          nodeId,
          JSON.stringify(updates),
        );

        // Update local state
        const { pipelines } = get();
        const pipeline = pipelines.get(currentPipelineId);
        if (pipeline) {
          const updatedNodes = pipeline.nodes.map((node) =>
            node.id === nodeId ? { ...node, ...updates } : node,
          );
          const updatedPipeline = { ...pipeline, nodes: updatedNodes };
          pipelines.set(currentPipelineId, updatedPipeline);
          set({ pipelines: new Map(pipelines) });
        }
      } catch (error) {
        console.error("Failed to update node:", error);
      }
    },

    loadPipeline: async (pipelineId: string) => {
      if (!pipelineId) {
        console.warn("⚠️ No pipelineId provided to loadPipeline");
        return;
      }

      set({ isLoading: true, error: null });

      try {
        console.log("📥 Loading pipeline:", pipelineId);
        const pipeline = await pipelineAPI.getPipeline(pipelineId);
        console.log("✅ Pipeline loaded:", pipeline);

        const { pipelines } = get();
        pipelines.set(pipelineId, pipeline);

        set({
          pipelines: new Map(pipelines),
          currentPipelineId: pipelineId,
          isLoading: false,
        });
      } catch (error) {
        console.error("❌ Failed to load pipeline:", error);
        set({
          error:
            error instanceof Error ? error.message : "Failed to load pipeline",
          isLoading: false,
        });
      }
    },

    setCurrentPipeline: (pipelineId: string | null) => {
      console.log("🎯 Setting current pipeline:", pipelineId);
      set({ currentPipelineId: pipelineId });
    },

    getCurrentPipeline: () => {
      const { pipelines, currentPipelineId } = get();
      if (!currentPipelineId) {
        console.log("📭 No current pipeline set");
        return null;
      }
      const pipeline = pipelines.get(currentPipelineId);
      console.log("📋 Current pipeline:", pipeline);
      return pipeline || null;
    },
    setViewport: (viewport) => {
      set((state) => ({ viewport: { ...state.viewport, ...viewport } }));
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
      get().setViewport({ zoom: 1, x: 0, y: 0 });
    },
    setSelection: (selection) => {
      set((state) => ({ selection: { ...state.selection, ...selection } }));
    },

    clearSelection: () => {
      set(() => ({ selection: { nodeIds: [], edgeIds: [], marquee: null } }));
    },
    moveSelectedNodes: (delta) => {
      const { pipelines, currentPipelineId, selection } = get();
      const setSel = new Set(selection.nodeIds);
      if (!currentPipelineId) return;

      const pipeline = pipelines.get(currentPipelineId ?? "");
      if (pipeline) {
        const updatedNodes = pipeline.nodes.map((node) => {
          if (setSel.has(node.id)) {
            return {
              ...node,
              position: {
                x: clamp(node.position.x + delta.x, -Infinity, Infinity),
                y: clamp(node.position.y + delta.y, -Infinity, Infinity),
              },
            };
          }
          return node;
        });

        const updatedPipeline = { ...pipeline, nodes: updatedNodes };
        pipelines.set(currentPipelineId, updatedPipeline);
        set({ pipelines: new Map(pipelines) });
      }
    },
  })),
);
