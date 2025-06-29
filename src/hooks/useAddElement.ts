import { Position } from "../types/baseElement";
import { ToolType } from "../types/element";
import { Venue } from "../types/venue";
import { generateId } from "../utils/generateId";

export const useAddElement = (
  venue: Venue,
  setVenue: (venue: Venue) => void,
  floorId: string
) => {

  return (toolType: ToolType, position:Position) => {
    console.log("Adding element:", toolType, "at position:", "x",position.x, ";y",position.y);
    const updatedFloors = venue.floors.map((floor) => {
      if (floor.id !== floorId) return floor;

      switch (toolType?.type) {
        case "stage":
          return {
            ...floor,
            stage: {
              id: generateId("stage"),
              type: "stage" as const,
              position:{
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
              id:generateId("controlRoom"),
              type: "controlRoom" as const,
              position:{
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
                position:{
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
                position:{
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
                position:{
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

        default:
          return floor;
      }
    });
console.log("Updated floors:", updatedFloors);
    setVenue({
      ...venue,
      floors: updatedFloors,
    });
  };
};
