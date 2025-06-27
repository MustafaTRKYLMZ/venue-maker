import { v4 as uuidv4 } from "uuid";

const SEAT_WIDTH = 20;
const SEAT_HEIGHT = 20;
const GAP = 2;
const generateId = (title: string, row?: number, col?: number) => {
  return `${title}-${uuidv4().substring(0, 4)}-${row}-${col}`;
};

export const createVenueHierarchy = (
  position: { x: number; y: number },
  rows: number,
  cols: number,
) => {
  const allRows = [];

  const totalGridWidth = cols * SEAT_WIDTH + (cols - 1) * GAP;
  const totalGridHeight = rows * SEAT_HEIGHT + (rows - 1) * GAP;

  const startX = position.x - totalGridWidth / 2;
  const startY = position.y - totalGridHeight / 2;

  // Rows + Seats
  for (let row = 0; row < rows; row++) {
    const rowSeats = [];
    const rowY = startY + row * (SEAT_HEIGHT + GAP);

    for (let col = 0; col < cols; col++) {
      const seatId = generateId("seat", row, col);
      const seatX = startX + col * (SEAT_WIDTH + GAP);

      const seat = {
        id: seatId,
        type: "seat",
        x: seatX,
        y: rowY,
        width: SEAT_WIDTH,
        height: SEAT_HEIGHT,
        fill: "orange",
        text: `S${row + 1}-${col + 1}`,
        fontSize: 12,
        draggable: true,
        seatType: "standard",
        label: `Row ${row + 1}, Col ${col + 1}`,
        position: { row: row + 1, col: col + 1, x: 0, y: 0 },
      };
      rowSeats.push(seat);
    }

    const rowId = generateId("row", row);
    const rowElement = {
      id: rowId,
      type: "row",
      x: startX,
      y: rowY,
      width: totalGridWidth,
      height: SEAT_HEIGHT,
      draggable: true,
      seats: rowSeats,
      text: `Row ${row + 1}`,
      name: `Row ${row + 1}`,
      position: { x: startX, y: rowY },
    };

    allRows.push(rowElement);
  }

  // Section
  const sectionId = generateId("section");
  const sectionElement = {
    id: sectionId,
    type: "section",
    width: totalGridWidth,
    height: totalGridHeight,
    draggable: true,
    rows: allRows,
    text: `Section ${sectionId}`,
    name: `Section ${sectionId}`,
    position: { x: startX, y: startY },
  };

  // Floor
  const floorId = generateId("floor");
  const floorElement = {
    id: floorId,
    type: "floor",
    width: totalGridWidth,
    height: totalGridHeight,
    draggable: true,
    sections: [sectionElement],
    text: `Floor ${floorId}`,
    name: `Floor ${floorId}`,
    position: { x: startX, y: startY },
  };

  // Venue
  const venueId = generateId("venue");
  const venueElement = {
    id: venueId,
    type: "venue",
    width: totalGridWidth,
    height: totalGridHeight,
    draggable: true,
    floors: [floorElement],
    text: `Venue ${venueId}`,
    name: `Venue ${venueId}`,
  };

  return venueElement;
};
