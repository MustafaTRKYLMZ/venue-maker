import { generateId } from "./generateId";

export const createRowsWithSeats = (
  rowCount: number,
  colCount: number,
  baseX: number,
  baseY: number,
) => {
  const rowSpacing = 40;
  const seatSpacing = 30;

  return Array.from({ length: rowCount }).map((_, rowIndex) => {
    const rowY = baseY + rowIndex * rowSpacing;

    const seats = Array.from({ length: colCount }).map((_, seatIndex) => ({
      id: generateId("seat"),
      type: "seat" as const,
      position: {
        x: baseX + seatIndex * seatSpacing,
        y: rowY,
      },
      label: `S-${rowIndex + 1}-${seatIndex + 1}`,
      fill: "#aaa",
      width: 20,
      height: 20,
      draggable: true,
      fontSize: 12,
    }));

    return {
      id: generateId("row"),
      type: "row" as const,
      position: {
        x: baseX,
        y: rowY,
      },
      seats,
    };
  });
};
