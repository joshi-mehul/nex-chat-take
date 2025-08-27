import { useTheme } from "@hooks/useTheme";
import { useFlowStore } from "@store/flowStore";
import { usePipelineStore } from "@store/pipelineStore";
import { hitTestNode } from "@utils/canvasUtils";
import { screenToWorld } from "@utils/geometry";
import { useEffect, useRef, useState } from "react";
import { renderScene } from "../canvas-renderer";

export const CanvasStage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    selection,
    currentPipelineId,
    pipelines,
    viewport,
    setViewport,
    setSelection,
    clearSelection,
    moveSelectedNodes,
  } = usePipelineStore();

  const currentPipeline = currentPipelineId
    ? pipelines.get(currentPipelineId)
    : null;

  const { mode } = useTheme();

  const hoveredNodeId = useFlowStore((s) => s.hoveredNodeId);
  const connecting = useFlowStore((s) => s.connecting);

  const beginConnect = useFlowStore((s) => s.beginConnect);
  const updateConnectingCursor = useFlowStore((s) => s.updateConnectingCursor);
  const completeConnect = useFlowStore((s) => s.completeConnect);
  const cancelConnect = useFlowStore((s) => s.cancelConnect);

  const removeNodes = useFlowStore((s) => s.removeNodes);
  const announce = useFlowStore((s) => s.announce);

  const [isPanning, setIsPanning] = useState(false);
  const [isDraggingNodes, setIsDraggingNodes] = useState(false); // New state for node dragging
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
    renderScene(
      {
        canvas,
        nodes: currentPipeline?.nodes ?? [],
        edges: currentPipeline?.connections ?? [],
        viewport: {
          zoom: viewport.zoom,
          offset: { x: viewport.x, y: viewport.y },
        },
        selectedNodeIds: selection.nodeIds,
        selectedEdgeIds: selection.edgeIds,
        hoveredNodeId,
        marquee: selection.marquee ?? null,
        connecting,
      },
      mode === "dark" ? "oklch(21% 0.034 264.665)" : "white",
    );
  }, [
    currentPipeline?.nodes,
    currentPipeline?.connections,
    viewport,
    selection,
    hoveredNodeId,
    connecting,
    mode,
  ]);

  // Mouse interactions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentPipeline) return;

    const getPos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: MouseEvent) => {
      const pos = getPos(e);
      const clickedNode = currentPipeline?.nodes.find((n) =>
        hitTestNode(n, pos.x, pos.y, viewport.zoom, {
          x: viewport.x,
          y: viewport.y,
        }),
      );

      if (e.altKey && clickedNode) {
        beginConnect(clickedNode.id, pos);
        return;
      }

      if (clickedNode) {
        // Select node if not already selected
        if (!selection.nodeIds.includes(clickedNode.id)) {
          setSelection({ nodeIds: [clickedNode.id], edgeIds: [] });
        }
        // Prepare for potential node dragging
        setNodeDragStart(pos);
        setIsDraggingNodes(false); // Start as false, will become true on first move
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

      if (connecting) {
        updateConnectingCursor(pos);
        return;
      }

      if (selection.marquee) {
        setSelection({ marquee: { start: selection.marquee.start, end: pos } });
        return;
      }

      // Only move nodes if we're actually dragging them (not just selected + mouse move)
      if (nodeDragStart && selection.nodeIds.length > 0) {
        // Set dragging state to true on first move
        if (!isDraggingNodes) {
          setIsDraggingNodes(true);
        }

        const dx = (pos.x - nodeDragStart.x) / viewport.zoom;
        const dy = (pos.y - nodeDragStart.y) / viewport.zoom;
        moveSelectedNodes({ x: dx, y: dy });
        setNodeDragStart(pos);
        return;
      }

      if (isPanning && dragStart) {
        setViewport({
          x: viewport.x + (pos.x - dragStart.x),
          y: viewport.y + (pos.y - dragStart.y),
        });
        setDragStart(pos);
        return;
      }
    };

    const onUp = (e: MouseEvent) => {
      const pos = getPos(e);

      if (connecting) {
        const overNode = currentPipeline?.nodes.find((n) =>
          hitTestNode(n, pos.x, pos.y, viewport.zoom, {
            x: viewport.x,
            y: viewport.y,
          }),
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
        const selected = currentPipeline?.nodes
          .filter((n) => {
            const x = n.position.x * viewport.zoom + viewport.x;
            const y = n.position.y * viewport.zoom + viewport.y;
            return x >= left && x <= right && y >= top && y <= bottom;
          })
          .map((n) => n.id);
        setSelection({ nodeIds: selected, edgeIds: [], marquee: null });
        announce(
          `${selected.length} node${selected.length === 1 ? "" : "s"} selected`,
        );
      }

      // Reset all drag states
      setIsPanning(false);
      setIsDraggingNodes(false);
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
        const worldBefore = screenToWorld(mouse, viewport.zoom, {
          x: viewport.x,
          y: viewport.y,
        });
        const worldAfter = screenToWorld(mouse, newZoom, {
          x: viewport.x,
          y: viewport.y,
        });
        const dx = (worldAfter.x - worldBefore.x) * newZoom;
        const dy = (worldAfter.y - worldBefore.y) * newZoom;

        setViewport({
          zoom: newZoom,
          x: viewport.x + dx,
          y: viewport.y + dy,
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
      if (e.key === "Escape") {
        clearSelection();
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
    currentPipeline?.nodes,
    currentPipeline?.connections,
    viewport,
    selection,
    connecting,
    isDraggingNodes,
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
    dragStart,
    isPanning,
    nodeDragStart,
  ]);

  return (
    <div className="relative flex-1 h-full">
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
