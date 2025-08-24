import type { Vector2 } from "@types/flow";


export const add = (a: Vector2, b: Vector2): Vector2 => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Vector2, b: Vector2): Vector2 => ({ x: a.x - b.x, y: a.y - b.y });

export const rectContains = (
  pt: Vector2,
  rect: { x: number; y: number; width: number; height: number }
) => pt.x >= rect.x && pt.x <= rect.x + rect.width && pt.y >= rect.y && pt.y <= rect.y + rect.height;

export const pointInMarquee = (pt: Vector2, a: Vector2, b: Vector2) => {
  const left = Math.min(a.x, b.x);
  const top = Math.min(a.y, b.y);
  const width = Math.abs(a.x - b.x);
  const height = Math.abs(a.y - b.y);
  return rectContains(pt, { x: left, y: top, width, height });
};

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export const distance = (a: Vector2, b: Vector2) => Math.hypot(a.x - b.x, a.y - b.y);

// Convert screen to world coordinates given zoom and offset
export const screenToWorld = (pt: Vector2, zoom: number, offset: Vector2): Vector2 => ({
  x: (pt.x - offset.x) / zoom,
  y: (pt.y - offset.y) / zoom
});

export const worldToScreen = (pt: Vector2, zoom: number, offset: Vector2): Vector2 => ({
  x: pt.x * zoom + offset.x,
  y: pt.y * zoom + offset.y
});
