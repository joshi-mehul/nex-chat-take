import type { FlowEdge, FlowNode, ViewportState } from "@types/flow";
import { clearAndGrid, setupCanvas } from "@utils/canvasUtils";
import { drawEdges } from "../draw-edges";
import { drawNodes } from "../draw-nodes";
import { drawMarquee } from "../draw-selection";

export type RenderInput = {
  canvas: HTMLCanvasElement;
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport: ViewportState;
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  hoveredNodeId: string | null;
  marquee: {
    start: { x: number; y: number };
    end: { x: number; y: number };
  } | null;
  connecting: { fromNodeId: string; cursor: { x: number; y: number } } | null;
};

export const renderScene = (input: RenderInput) => {
  const ctx = setupCanvas(input.canvas);
  clearAndGrid(ctx, input.viewport);

  const nodesById = new Map(input.nodes.map((n) => [n.id, n]));
  const selectedNodeSet = new Set(input.selectedNodeIds);
  const selectedEdgeSet = new Set(input.selectedEdgeIds);

  // Edges first (so nodes draw on top)
  drawEdges(ctx, input.edges, nodesById, input.viewport, selectedEdgeSet);

  // Connection ghost edge if any
  if (input.connecting) {
    const fromNode = nodesById.get(input.connecting.fromNodeId);
    if (fromNode) {
      const { zoom, offset } = input.viewport;
      const sx =
        (fromNode.position.x + fromNode.size.width / 2) * zoom + offset.x;
      const sy =
        (fromNode.position.y + fromNode.size.height / 2) * zoom + offset.y;
      const tx = input.connecting.cursor.x;
      const ty = input.connecting.cursor.y;
      ctx.strokeStyle = "#0ea5e9";
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  drawNodes(
    ctx,
    input.nodes,
    input.viewport,
    selectedNodeSet,
    input.hoveredNodeId,
  );

  // Marquee on top
  if (input.marquee) {
    drawMarquee(ctx, input.marquee.start, input.marquee.end, input.viewport);
  }
};
