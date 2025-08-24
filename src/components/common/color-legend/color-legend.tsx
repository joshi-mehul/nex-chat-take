export const ColorLegend = () => {
  const items = [
    { label: "Source", color: "#2563eb" },
    { label: "Transform", color: "#a855f7" },
    { label: "Destination", color: "#16a34a" },
  ];
  return (
    <div className="flex items-center gap-3 text-xs text-gray-600">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-1">
          <span
            style={{ backgroundColor: i.color }}
            className="inline-block h-2.5 w-2.5 rounded"
          />
          {i.label}
        </div>
      ))}
    </div>
  );
};
