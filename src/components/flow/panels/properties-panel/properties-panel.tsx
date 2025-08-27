import StatusBadge from "@components/flow/status-badge/status-badge";
import { useFlowStore } from "@store/flowStore";
import { usePipelineStore } from "@store/pipelineStore";
import type { NodeStatus } from "@types/flow";
import { useMemo } from "react";

export const PropertiesPanel = () => {
  const nodes = useFlowStore((s) => s.nodes);

  const updateNode = useFlowStore((s) => s.updateNode);
  const removeNodes = useFlowStore((s) => s.removeNodes);

  const { selection, currentPipelineId, pipelines } = usePipelineStore();

  const selectedNodeSet = new Set(selection.nodeIds);
  const selectedNode = useMemo(
    () =>
      pipelines
        .get(currentPipelineId ?? "")
        ?.nodes.find((n) => selectedNodeSet.has(n.id)),
    [nodes, selection.nodeIds, currentPipelineId, pipelines,selectedNodeSet],
  );

  if (!selectedNode) {
    return null;
  }

  return (
    <aside
      aria-label="Properties"
      className="w-80 shrink-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
    >
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Properties
        </h2>
        <StatusBadge status={selectedNode.status ?? "idle"} />
      </header>

      <div className="mt-3 space-y-3">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400">
            Label
          </label>
          <input
            className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 focus-visible:shadow-focus focus:border-blue-500 dark:focus:border-blue-400"
            value={selectedNode.label}
            onChange={(e) =>
              updateNode(selectedNode.id, { label: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400">
              X
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 focus:border-blue-500 dark:focus:border-blue-400"
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
            <label className="block text-xs text-gray-600 dark:text-gray-400">
              Y
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 focus:border-blue-500 dark:focus:border-blue-400"
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
            <label className="block text-xs text-gray-600 dark:text-gray-400">
              Width
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 focus:border-blue-500 dark:focus:border-blue-400"
              value={Math.round(selectedNode.size.width)}
              onChange={(e) =>
                updateNode(selectedNode.id, {
                  size: { ...selectedNode.size, width: Number(e.target.value) },
                })
              }
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400">
              Height
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 focus:border-blue-500 dark:focus:border-blue-400"
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
          <label className="block text-xs text-gray-600 dark:text-gray-400">
            Status
          </label>
          <select
            className="mt-1 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 focus:border-blue-500 dark:focus:border-blue-400"
            value={selectedNode.status ?? "idle"}
            onChange={(e) =>
              updateNode(selectedNode.id, {
                status: e.target.value as unknown as NodeStatus,
              })
            }
          >
            <option value="idle">Idle</option>
            <option value="running">Running</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400">
            Color (override)
          </label>
          <input
            type="color"
            className="mt-1 h-9 w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 focus:border-blue-500 dark:focus:border-blue-400"
            value={selectedNode.color ?? "#000000"}
            onChange={(e) =>
              updateNode(selectedNode.id, { color: e.target.value })
            }
          />
        </div>

        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white transition-colors"
            onClick={() => removeNodes([selectedNode.id])}
          >
            Delete node
          </button>
        </div>
      </div>
    </aside>
  );
};
