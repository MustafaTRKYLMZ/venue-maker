import { useCallback } from "react";
import { Section, Venue } from "../types/venue";
import { v4 as uuidv4 } from "uuid";

export const useAddSection = (
  venue: Venue,
  setVenue: React.Dispatch<React.SetStateAction<Venue>>,
  selectedFloorId: string,
) => {
  const addSection = useCallback(
    (rows: number, cols: number) => {
      const floorIndex = venue.floors.findIndex(
        (floor) => floor.id === selectedFloorId,
      );
      if (floorIndex === -1) return;

      const newSection = {
        id: uuidv4(),
        type: "section",
        label: `Section ${venue.floors[floorIndex].sections.length + 1}`,
        position: { x: 100, y: 100 },
        width: cols * 20,
        height: rows * 20,
        fill: "#ccc",
        draggable: true,
        fontSize: 12,
        rows: Array.from({ length: rows }, (_, rowIndex) => ({
          id: uuidv4(),
          type: "row",
          label: `Row ${rowIndex + 1}`,
          position: { x: 0, y: rowIndex * 20 },
          width: cols * 20,
          height: 20,
          fill: "#bbb",
          draggable: false,
          fontSize: 12,
          seats: Array.from({ length: cols }, (_, colIndex) => ({
            id: uuidv4(),
            type: "seat",
            seatType: "standard",
            label: `${rowIndex + 1}-${colIndex + 1}`,
            position: { x: colIndex * 20, y: 0 },
            width: 20,
            height: 20,
            fill: "#999",
            draggable: false,
            fontSize: 10,
          })),
        })),
      } as Section;

      const updatedFloors = [...venue.floors];
      updatedFloors[floorIndex].sections.push(newSection);

      setVenue({ ...venue, floors: updatedFloors });
    },
    [venue, setVenue, selectedFloorId],
  );

  return addSection;
};
