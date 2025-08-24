import { STATUS_LABELS } from "@constants/constants";
import type { NodeStatus } from "@types/flow";


const colorMap: Record<NodeStatus, string> = {
  idle: "bg-gray-400",
  running: "bg-amber-500",
  success: "bg-green-500",
  error: "bg-red-500"
};

export default function StatusBadge({ status }: { status: NodeStatus }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-700">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${colorMap[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}
