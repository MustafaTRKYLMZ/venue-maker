import { Position } from "../types/baseElement";
import { ToolType } from "../types/element";
import { Venue } from "../types/venue";
import { createRowsWithSeats } from "../utils/createRowsWithSeats";
import { generateId } from "../utils/generateId";

export const useAddElement = (
  venue: Venue,
  setVenue: (venue: Venue) => void,
  floorId: string,
) => {
  return (
    toolType: ToolType,
    position: Position,
    options?: { rowCount?: number; colCount?: number },
  ) => {
    const updatedFloors = venue.floors.map((floor) => {
      if (floor.id !== floorId) return floor;

      switch (toolType?.type) {
        case "stage":
          return {
            ...floor,
            stage: {
              id: generateId("stage"),
              type: "stage" as const,
              position: {
                x: position.x,
                y: position.y,
              },
              width: 200,
              height: 100,
              label: "Stage",
              fill: "#ccc",
              draggable: true,
              fontSize: 14,
            },
          };

        case "controlRoom":
          return {
            ...floor,
            controlRoom: {
              id: generateId("controlRoom"),
              type: "controlRoom" as const,
              position: {
                x: position.x,
                y: position.y,
              },
              width: 150,
              height: 80,
              label: "Control Room",
              fill: "#ccc",
              draggable: true,
              fontSize: 14,
            },
          };

        case "door":
          return {
            ...floor,
            doors: [
              ...(floor.doors || []),
              {
                id: generateId("door"),
                type: "door" as const,
                position: {
                  x: position.x,
                  y: position.y,
                },
                width: 40,
                height: 10,
                direction: "in" as "in" | "out",
                label: "Door",
                fill: "#ccc",
                draggable: true,
                fontSize: 12,
              },
            ],
          };
        case "wall":
          return {
            ...floor,
            walls: [
              ...(floor.walls || []),
              {
                id: generateId("wall"),
                type: "wall" as const,
                position: {
                  x: position.x,
                  y: position.y,
                },
                width: 100,
                height: 10,
                label: "Wall",
                fill: "#ccc",
                draggable: true,
                fontSize: 12,
              },
            ],
          };
        case "light":
          return {
            ...floor,
            lights: [
              ...(floor.lights || []),
              {
                id: generateId("light"),
                type: "light" as const,
                position: {
                  x: position.x,
                  y: position.y,
                },
                radius: 10,
                lightType: "spot" as "spot" | "flood" | "ambient",
                label: "Light",
                width: 20,
                height: 20,
                fill: "#fff",
                draggable: true,
                fontSize: 12,
              },
            ],
          };
        case "section":
          const rowCount = options?.rowCount ?? 1;
          const colCount = options?.colCount ?? 1;

          const seatWidth = 20;
          const seatGap = 8;
          const rowHeight = 30;
          const rowGap = 10;
          const paddingX = 20;
          const paddingY = 20;

          const sectionWidth =
            paddingX * 2 + colCount * seatWidth + (colCount - 1) * seatGap;

          const sectionHeight =
            paddingY * 2 + rowCount * rowHeight + (rowCount - 1) * rowGap;

          const config = {
            seatWidth,
            seatGap,
            rowHeight,
            rowGap,
            paddingX,
            paddingY,
          };

          const rows = createRowsWithSeats(
            rowCount,
            colCount,
            position.x,
            position.y,
            config,
          ).map((row) => ({
            ...row,
            type: "row" as const,
            label: "Row",
            width: colCount * seatWidth + (colCount - 1) * seatGap,
            height: rowHeight,
            fill: "#ccc",
            draggable: true,
            fontSize: 12,
            seats: row.seats.map((seat) => ({
              ...seat,
              seatType: "standard" as const,
            })),
          }));

          return {
            ...floor,
            sections: [
              ...(floor.sections || []),
              {
                id: generateId("section"),
                type: "section" as const,
                position,
                label: "Section",
                fill: "#ccc",
                draggable: true,
                fontSize: 14,
                width: sectionWidth,
                height: sectionHeight,
                rows,
              },
            ],
          };

        default:
          return floor;
      }
    });

    setVenue({
      ...venue,
      floors: updatedFloors,
    });
  };
};
