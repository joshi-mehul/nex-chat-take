import { useFlowStore } from "@store/flowStore";
import { useEffect, useRef, useState } from "react";
import { renderScene } from "../canvas-renderer";
import { hitTestNode } from "@utils/canvasUtils";
import { screenToWorld } from "@utils/geometry";

export const CanvasStage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const viewport = useFlowStore((s) => s.viewport);
  const selection = useFlowStore((s) => s.selection);
  const hoveredNodeId = useFlowStore((s) => s.hoveredNodeId);
  const connecting = useFlowStore((s) => s.connecting);

  const setViewport = useFlowStore((s) => s.setViewport);
  const setSelection = useFlowStore((s) => s.setSelection);
  const clearSelection = useFlowStore((s) => s.clearSelection);
  const moveSelectedNodes = useFlowStore((s) => s.moveSelectedNodes);

  const beginConnect = useFlowStore((s) => s.beginConnect);
  const updateConnectingCursor = useFlowStore((s) => s.updateConnectingCursor);
  const completeConnect = useFlowStore((s) => s.completeConnect);
  const cancelConnect = useFlowStore((s) => s.cancelConnect);

  const removeNodes = useFlowStore((s) => s.removeNodes);
  const announce = useFlowStore((s) => s.announce);

  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [nodeDragStart, setNodeDragStart] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderScene({
      canvas,
      nodes,
      edges,
      viewport,
      selectedNodeIds: selection.nodeIds,
      selectedEdgeIds: selection.edgeIds,
      hoveredNodeId,
      marquee: selection.marquee ?? null,
      connecting,
    });
  }, [nodes, edges, viewport, selection, hoveredNodeId, connecting]);

  // Mouse interactions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: MouseEvent) => {
      const pos = getPos(e);
      const clickedNode = nodes.find((n) =>
        hitTestNode(n, pos.x, pos.y, viewport.zoom, viewport.offset),
      );

      if (e.altKey && clickedNode) {
        beginConnect(clickedNode.id, pos);
        return;
      }

      if (clickedNode) {
        // select node
        if (!selection.nodeIds.includes(clickedNode.id)) {
          setSelection({ nodeIds: [clickedNode.id], edgeIds: [] });
        }
        setNodeDragStart(pos);
      } else {
        // Start panning or marquee
        if (e.shiftKey) {
          setSelection({ marquee: { start: pos, end: pos } });
        } else {
          setIsPanning(true);
          setDragStart(pos);
        }
        setSelection({ nodeIds: [], edgeIds: [] });
      }
    };

    const onMove = (e: MouseEvent) => {
      const pos = getPos(e);
      if (connecting) updateConnectingCursor(pos);

      if (selection.marquee) {
        setSelection({ marquee: { start: selection.marquee.start, end: pos } });
        return;
      }

      if (nodeDragStart) {
        const dx = (pos.x - nodeDragStart.x) / viewport.zoom;
        const dy = (pos.y - nodeDragStart.y) / viewport.zoom;
        moveSelectedNodes({ x: dx, y: dy });
        setNodeDragStart(pos);
        return;
      }

      if (isPanning && dragStart) {
        setViewport({
          offset: {
            x: viewport.offset.x + (pos.x - dragStart.x),
            y: viewport.offset.y + (pos.y - dragStart.y),
          },
        });
        setDragStart(pos);
        return;
      }
    };

    const onUp = (e: MouseEvent) => {
      const pos = getPos(e);
      if (connecting) {
        const overNode = nodes.find((n) =>
          hitTestNode(n, pos.x, pos.y, viewport.zoom, viewport.offset),
        );
        if (overNode) completeConnect(overNode.id);
        else cancelConnect();
      }

      if (selection.marquee) {
        // Simple marquee: select nodes by their top-left point being inside
        const start = selection.marquee.start;
        const end = pos;
        const left = Math.min(start.x, end.x);
        const top = Math.min(start.y, end.y);
        const right = Math.max(start.x, end.x);
        const bottom = Math.max(start.y, end.y);
        const selected = nodes
          .filter((n) => {
            const x = n.position.x * viewport.zoom + viewport.offset.x;
            const y = n.position.y * viewport.zoom + viewport.offset.y;
            return x >= left && x <= right && y >= top && y <= bottom;
          })
          .map((n) => n.id);
        setSelection({ nodeIds: selected, edgeIds: [], marquee: null });
        announce(
          `${selected.length} node${selected.length === 1 ? "" : "s"} selected`,
        );
      }

      setIsPanning(false);
      setDragStart(null);
      setNodeDragStart(null);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const direction = Math.sign(e.deltaY);
        const zoomFactor = direction > 0 ? 0.9 : 1.1;
        const newZoom = Math.min(3, Math.max(0.25, viewport.zoom * zoomFactor));

        // Zoom towards mouse position
        const rect = canvas.getBoundingClientRect();
        const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const worldBefore = screenToWorld(
          mouse,
          viewport.zoom,
          viewport.offset,
        );
        const worldAfter = screenToWorld(mouse, newZoom, viewport.offset);
        const dx = (worldAfter.x - worldBefore.x) * newZoom;
        const dy = (worldAfter.y - worldBefore.y) * newZoom;

        setViewport({
          zoom: newZoom,
          offset: { x: viewport.offset.x + dx, y: viewport.offset.y + dy },
        });
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        ["Delete", "Backspace"].includes(e.key) &&
        selection.nodeIds.length > 0
      ) {
        removeNodes(selection.nodeIds);
      }
    };

    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    nodes,
    edges,
    viewport,
    selection,
    connecting,
    setViewport,
    setSelection,
    clearSelection,
    moveSelectedNodes,
    beginConnect,
    updateConnectingCursor,
    completeConnect,
    cancelConnect,
    removeNodes,
    announce,
  ]);

  return (
    <div className="relative flex-1">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-white"
        role="application"
        aria-label="Flow canvas"
        tabIndex={0}
      />
    </div>
  );
};
