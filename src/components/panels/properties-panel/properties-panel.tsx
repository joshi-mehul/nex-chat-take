import StatusBadge from "@components/common/status-badge/status-badge";
import { useFlowStore } from "@store/flowStore";
import { useMemo } from "react";

export const PropertiesPanel = () => {
  const nodes = useFlowStore((s) => s.nodes);
  const selection = useFlowStore((s) => s.selection);
  const updateNode = useFlowStore((s) => s.updateNode);
  const removeNodes = useFlowStore((s) => s.removeNodes);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selection.nodeIds[0]),
    [nodes, selection.nodeIds],
  );

  if (!selectedNode) {
    return null;
  }

  return (
    <aside
      aria-label="Properties"
      className="w-80 shrink-0 border-l border-gray-200 bg-white p-4"
    >
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Properties</h2>
        <StatusBadge status={selectedNode.status ?? "idle"} />
      </header>

      <div className="mt-3 space-y-3">
        <div>
          <label className="block text-xs text-gray-600">Label</label>
          <input
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 focus-visible:shadow-focus"
            value={selectedNode.label}
            onChange={(e) =>
              updateNode(selectedNode.id, { label: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600">X</label>
            <input
              type="number"
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
              value={Math.round(selectedNode.position.x)}
              onChange={(e) =>
                updateNode(selectedNode.id, {
                  position: {
                    ...selectedNode.position,
                    x: Number(e.target.value),
                  },
                })
              }
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Y</label>
            <input
              type="number"
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
              value={Math.round(selectedNode.position.y)}
              onChange={(e) =>
                updateNode(selectedNode.id, {
                  position: {
                    ...selectedNode.position,
                    y: Number(e.target.value),
                  },
                })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600">Width</label>
            <input
              type="number"
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
              value={Math.round(selectedNode.size.width)}
              onChange={(e) =>
                updateNode(selectedNode.id, {
                  size: { ...selectedNode.size, width: Number(e.target.value) },
                })
              }
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Height</label>
            <input
              type="number"
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
              value={Math.round(selectedNode.size.height)}
              onChange={(e) =>
                updateNode(selectedNode.id, {
                  size: {
                    ...selectedNode.size,
                    height: Number(e.target.value),
                  },
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600">Status</label>
          <select
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1"
            value={selectedNode.status ?? "idle"}
            onChange={(e) =>
              updateNode(selectedNode.id, { status: e.target.value as any })
            }
          >
            <option value="idle">Idle</option>
            <option value="running">Running</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600">
            Color (override)
          </label>
          <input
            type="color"
            className="mt-1 h-9 w-full rounded border border-gray-300 px-2 py-1"
            value={selectedNode.color ?? "#000000"}
            onChange={(e) =>
              updateNode(selectedNode.id, { color: e.target.value })
            }
          />
        </div>

        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={() => removeNodes([selectedNode.id])}
          >
            Delete node
          </button>
        </div>
      </div>
    </aside>
  );
};
