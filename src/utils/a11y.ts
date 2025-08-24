export function statusText(status?: string) {
  switch (status) {
    case "pending":
      return "Pending";
    case "partial":
      return "Partial";
    case "complete":
      return "Complete";
    case "error":
      return "Error";
    default:
      return "Unknown";
  }
}

export function kindText(kind?: string) {
  if (!kind) return "Node";
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}
