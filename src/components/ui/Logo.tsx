export function Logo({ size = 26 }: { size?: number }) {
  // A five-row pixel grid that reads as a brain at 26px — the mark in the rail.
  const cells: [number, number, string][] = [
    [1, 0, "#f472b6"], [2, 0, "#a78bfa"], [3, 0, "#60a5fa"],
    [0, 1, "#fb7185"], [1, 1, "#c084fc"], [2, 1, "#818cf8"], [3, 1, "#38bdf8"], [4, 1, "#34d399"],
    [0, 2, "#fbbf24"], [1, 2, "#f472b6"], [2, 2, "#a78bfa"], [3, 2, "#60a5fa"], [4, 2, "#22d3ee"],
    [0, 3, "#fb923c"], [1, 3, "#f87171"], [2, 3, "#c084fc"], [3, 3, "#818cf8"], [4, 3, "#4ade80"],
    [1, 4, "#f59e0b"], [2, 4, "#ec4899"], [3, 4, "#8b5cf6"],
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 5 5"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {cells.map(([x, y, fill]) => (
        <rect
          key={`${x}-${y}`}
          x={x + 0.06}
          y={y + 0.06}
          width={0.88}
          height={0.88}
          rx={0.24}
          fill={fill}
        />
      ))}
    </svg>
  );
}
