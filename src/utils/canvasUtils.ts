import { RENDER } from "@constants/constants";
import type { ViewportState } from "@types/flow";
import type { Node } from "@types/pipeline";

export const withCtx = <T>(ctx: CanvasRenderingContext2D, fn: () => T): T => {
  ctx.save();
  try {
    return fn();
  } finally {
    ctx.restore();
  }
};

export const setupCanvas = (
  canvas: HTMLCanvasElement,
  dpr = window.devicePixelRatio || 1,
) => {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
};

export const clearAndGrid = (
  ctx: CanvasRenderingContext2D,
  viewport: ViewportState,
  backgroundColor: string = "oklch(98.5% 0.002 247.839)",
) => {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Grid dots
  const { zoom, offset } = viewport;
  const gridSize = RENDER.gridSize * zoom;
  const startX = offset.x % gridSize;
  const startY = offset.y % gridSize;

  ctx.fillStyle = "rgba(100,116,139,0.4)"; // Made slightly more visible

  // Fixed dot radius - simple and reliable
  const dotRadius = 1;

  for (let x = startX; x < width; x += gridSize) {
    for (let y = startY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

export const getNodeColor = (node: Node) => {
  if (node.color) return node.color;
  switch (node.kind) {
    case "source":
      return "#2563eb";
    case "transform":
      return "#a855f7";
    case "destination":
      return "#16a34a";
  }
};

export const getStatusColor = (status?: Node["status"]) => {
  switch (status) {
    case "running":
    case "partial":
      return "#f59e0b";
    case "success":
    case "complete":
      return "#22c55e";
    case "error":
      return "#ef4444";
    default:
      return "#9ca3af";
  }
};

export const hitTestNode = (
  node: Node,
  x: number,
  y: number,
  zoom: number,
  offset: { x: number; y: number },
) => {
  const left = node.position.x * zoom + offset.x;
  const top = node.position.y * zoom + offset.y;
  const width = node.size.width * zoom;
  const height = node.size.height * zoom;
  return x >= left && x <= left + width && y >= top && y <= top + height;
};

export const nearestPortPoint = (node: Node) => {
  // Simple: connect from node center
  const cx = node.position.x + node.size.width / 2;
  const cy = node.position.y + node.size.height / 2;
  return { x: cx, y: cy };
};

export const computeEdgePath = (
  from: { x: number; y: number },
  to: { x: number; y: number },
) => {
  // Smooth cubic curve
  const dx = Math.abs(to.x - from.x);
  const cx1 = from.x + dx * 0.5;
  const cy1 = from.y;
  const cx2 = to.x - dx * 0.5;
  const cy2 = to.y;
  return { cx1, cy1, cx2, cy2 };
};

export const drawPath = (
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
) => {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.stroke();
};

export const drawCubic = (
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  c1: { x: number; y: number },
  c2: { x: number; y: number },
) => {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, to.x, to.y);
  ctx.stroke();
};

export const drawEdgeLabel = (
  ctx: CanvasRenderingContext2D,
  mid: { x: number; y: number },
  label?: string,
) => {
  if (!label) return;
  ctx.save();
  ctx.fillStyle = "white";
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 4;
  ctx.font = "12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
  const padding = 6;
  const textWidth = ctx.measureText(label).width;
  const w = textWidth + padding * 2;
  const h = 18;
  const x = mid.x - w / 2;
  const y = mid.y - h / 2;
  ctx.strokeRect(x, y, w, h);
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#111827"; // gray-900
  ctx.fillText(label, x + padding, y + 13);
  ctx.restore();
};

export const arcArrow = (
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
) => {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const size = 8;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - size * Math.cos(angle - Math.PI / 6),
    to.y - size * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    to.x - size * Math.cos(angle + Math.PI / 6),
    to.y - size * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
};
