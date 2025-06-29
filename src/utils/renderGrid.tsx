import { Line } from "react-konva";

export const renderGrid = (width: number, height: number) => {
  const GRID_SIZE = 20;
  const lines = [];

  const gridWidth = width * 5;
  const gridHeight = height * 5;

  const halfWidth = gridWidth / 2;
  const halfHeight = gridHeight / 2;

  for (let x = -halfWidth; x <= halfWidth; x += GRID_SIZE) {
    lines.push(
      <Line
        key={`vline-${x}`}
        points={[x, -halfHeight, x, halfHeight]}
        stroke="#ddd"
        strokeWidth={1}
        listening={false}
      />,
    );
  }

  for (let y = -halfHeight; y <= halfHeight; y += GRID_SIZE) {
    lines.push(
      <Line
        key={`hline-${y}`}
        points={[-halfWidth, y, halfWidth, y]}
        stroke="#ddd"
        strokeWidth={1}
        listening={false}
      />,
    );
  }

  return <>{lines}</>;
};
