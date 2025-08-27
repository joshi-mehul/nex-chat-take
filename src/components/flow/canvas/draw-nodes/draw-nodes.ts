import type { FlowNode, ViewportState } from "@types/flow";
import { getNodeColor, getStatusColor, withCtx } from "@utils/canvasUtils";

export const drawNodes = (
  ctx: CanvasRenderingContext2D,
  nodes: FlowNode[],
  viewport: ViewportState,
  selectedIds: Set<string>,
  hoveredId: string | null,
) => {
  const { zoom, offset } = viewport;

  nodes.forEach((node) => {
    if (node.hidden) return;

    const x = node.position.x * zoom + offset.x;
    const y = node.position.y * zoom + offset.y;
    const w = node.size.width * zoom;
    const h = node.size.height * zoom;
    const r = Math.max(6, 6 * zoom);

    withCtx(ctx, () => {
      // Node body
      ctx.fillStyle = getNodeColor(node);
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1;
      roundRect(ctx, x, y, w, h, r);
      ctx.fill();
      ctx.stroke();

      // Focus/hover/selection ring
      if (selectedIds.has(node.id)) {
        ctx.strokeStyle = "rgba(59,130,246,0.9)";
        ctx.lineWidth = 2;
        roundRect(ctx, x - 2, y - 2, w + 4, h + 4, r);
        ctx.stroke();
      } else if (hoveredId === node.id) {
        ctx.strokeStyle = "rgba(59,130,246,0.5)";
        ctx.lineWidth = 2;
        roundRect(ctx, x - 2, y - 2, w + 4, h + 4, r);
        ctx.stroke();
      }

      // Title and icon
      ctx.fillStyle = "white";
      ctx.font = `${Math.max(12, 12 * zoom)}px ui-sans-serif, system-ui`;
      const padding = 10 * zoom;
      if (node.icon) {
        ctx.fillText(node.icon, x + padding, y + 20 * zoom);
      }
      const labelX = node.icon ? x + padding + 18 * zoom : x + padding;
      ctx.fillText(node.label, labelX, y + 20 * zoom);

      // Status badge (right)
      const statusColor = getStatusColor(node.status);
      const badgeW = 10 * zoom;
      ctx.fillStyle = statusColor;
      ctx.beginPath();
      ctx.arc(x + w - padding, y + padding, badgeW / 2, 0, Math.PI * 2);
      ctx.fill();
    });
  });
};

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};
