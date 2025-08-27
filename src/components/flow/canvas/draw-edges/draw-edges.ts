import type { ViewportState } from "@types/flow";
import type { Connection, Node } from "@types/pipeline";
import {
  computeEdgePath,
  drawCubic,
  drawEdgeLabel,
  nearestPortPoint,
} from "@utils/canvasUtils";

export const drawEdges = (
  ctx: CanvasRenderingContext2D,
  edges: Connection[],
  nodesById: Map<string, Node>,
  viewport: ViewportState,
  selectedIds: Set<string>,
) => {
  const { zoom, offset } = viewport;

  edges.forEach((edge) => {
    const from = nodesById.get(edge.fromNodeId);
    const to = nodesById.get(edge.toNodeId);
    if (!from || !to) return;

    const fromPoint = nearestPortPoint(from);
    const toPoint = nearestPortPoint(to, from.position);

    const sx = fromPoint.x * zoom + offset.x;
    const sy = fromPoint.y * zoom + offset.y;
    const tx = toPoint.x * zoom + offset.x;
    const ty = toPoint.y * zoom + offset.y;

    const { cx1, cy1, cx2, cy2 } = computeEdgePath(
      { x: sx, y: sy },
      { x: tx, y: ty },
    );

    // Style
    ctx.strokeStyle = selectedIds.has(edge.id)
      ? "#0ea5e9"
      : (edge.color ?? "#64748b");
    ctx.lineWidth = 2;
    ctx.setLineDash(edge.dashed ? [8, 6] : []);
    drawCubic(
      ctx,
      { x: sx, y: sy },
      { x: tx, y: ty },
      { x: cx1, y: cy1 },
      { x: cx2, y: cy2 },
    );

    // Arrow head
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    // Simple arrow using last segment direction
    const angle = Math.atan2(ty - cy2, tx - cx2);
    const size = 8;
    ctx.moveTo(tx, ty);
    ctx.lineTo(
      tx - size * Math.cos(angle - Math.PI / 6),
      ty - size * Math.sin(angle - Math.PI / 6),
    );
    ctx.lineTo(
      tx - size * Math.cos(angle + Math.PI / 6),
      ty - size * Math.sin(angle + Math.PI / 6),
    );
    ctx.closePath();
    ctx.fill();

    // Label at curve midpoint (approx)
    const mid = { x: (sx + tx) / 2, y: (sy + ty) / 2 };
    drawEdgeLabel(ctx, mid, edge.label);
  });
};
