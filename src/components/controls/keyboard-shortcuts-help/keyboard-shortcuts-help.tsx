export const KeyboardShortcutsHelp = () => {
  return (
    <details className="px-3 py-2 text-xs text-gray-700">
      <summary className="cursor-pointer select-none">
        Keyboard shortcuts
      </summary>
      <ul className="mt-2 list-disc pl-5 space-y-1">
        <li>Click empty space and drag: pan</li>
        <li>Mouse wheel: zoom</li>
        <li>Drag on empty space + Shift: marquee select</li>
        <li>Click a node to select; drag to move</li>
        <li>Delete/Backspace: delete selected nodes</li>
        <li>Hold Alt while dragging from a node: start connection</li>
      </ul>
    </details>
  );
};
