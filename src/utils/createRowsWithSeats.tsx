import { generateId } from "./generateId";

export const createRowsWithSeats = (
  rowCount: number,
  colCount: number,
  baseX: number,
  baseY: number,
  config?: {
    seatWidth?: number;
    seatGap?: number;
    rowHeight?: number;
    rowGap?: number;
    paddingX?: number;
    paddingY?: number;
  },
) => {
  const seatWidth = config?.seatWidth ?? 20;
  const seatGap = config?.seatGap ?? 8;
  const rowHeight = config?.rowHeight ?? 30;
  const rowGap = config?.rowGap ?? 10;
  const paddingX = config?.paddingX ?? 10;
  const paddingY = config?.paddingY ?? 10;

  return Array.from({ length: rowCount }).map((_, rowIndex) => {
    const rowY = paddingY + rowIndex * (rowHeight + rowGap);

    const seats = Array.from({ length: colCount }).map((_, seatIndex) => ({
      id: generateId("seat"),
      type: "seat" as const,
      position: {
        x: seatIndex * (seatWidth + seatGap),
        y: (rowHeight - seatWidth) / 2,
      },
      label: `S-${rowIndex + 1}-${seatIndex + 1}`,
      fill: "#aaa",
      width: seatWidth,
      height: seatWidth,
      draggable: true,
      fontSize: 12,
    }));

    return {
      id: generateId("row"),
      type: "row" as const,

      position: {
        x: paddingX,
        y: rowY,
      },
      seats,
    };
  });
};
