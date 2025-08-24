import { useFlowStore } from "@store/flowStore";
import { useMemo, useRef, useEffect } from "react";


export default function MiniMap() {
  const { nodes, viewport } = useFlowStore(s => ({ nodes: s.nodes, viewport: s.viewport }));
  const ref = useRef<HTMLCanvasElement | null>(null);

  const bounds = useMemo(() => {
    if (nodes.length === 0) return { left: 0, top: 0, right: 1000, bottom: 1000 };
    const left = Math.min(...nodes.map(n => n.position.x));
    const top = Math.min(...nodes.map(n => n.position.y));
    const right = Math.max(...nodes.map(n => n.position.x + n.size.width));
    const bottom = Math.max(...nodes.map(n => n.position.y + n.size.height));
    return { left, top, right, bottom };
  }, [nodes]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,rect.width, rect.height);
    ctx.strokeStyle = "#e5e7eb"; // gray-200
    ctx.strokeRect(0,0,rect.width, rect.height);

    const w = bounds.right - bounds.left;
    const h = bounds.bottom - bounds.top;
    const scale = Math.min(rect.width / (w || 1), rect.height / (h || 1));

    nodes.forEach(n => {
      const x = (n.position.x - bounds.left) * scale + 4;
      const y = (n.position.y - bounds.top) * scale + 4;
      const nw = n.size.width * scale;
      const nh = n.size.height * scale;
      ctx.fillStyle = n.color ?? (n.kind === "source" ? "#2563eb" : n.kind === "transform" ? "#a855f7" : "#16a34a");
      ctx.fillRect(x, y, nw, nh);
    });

    // Viewport box (approx)
    ctx.strokeStyle = "#0ea5e9";
    ctx.setLineDash([4,3]);
    ctx.strokeRect(6, 6, rect.width - 12, rect.height - 12);
    ctx.setLineDash([]);
  }, [bounds, nodes, viewport]);

  return (
    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded border border-gray-200 p-2">
      <canvas
        ref={ref}
        width={180}
        height={120}
        className="w-[180px] h-[120px]"
        aria-hidden="true"
      />
    </div>
  );
}
