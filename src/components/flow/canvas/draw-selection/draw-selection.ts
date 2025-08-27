import { RENDER } from "@constants/constants";
import { withCtx } from "@utils/canvasUtils";

export const drawMarquee = (
  ctx: CanvasRenderingContext2D,
  a: { x: number; y: number },
  b: { x: number; y: number },
) => {
  const left = Math.min(a.x, b.x);
  const top = Math.min(a.y, b.y);
  const width = Math.abs(a.x - b.x);
  const height = Math.abs(a.y - b.y);

  withCtx(ctx, () => {
    ctx.fillStyle = RENDER.selectionColor;
    ctx.strokeStyle = "rgba(59,130,246,0.9)";
    ctx.lineWidth = 1.5;
    ctx.fillRect(left, top, width, height);
    ctx.strokeRect(left, top, width, height);
  });
};
