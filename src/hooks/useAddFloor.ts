import { v4 as uuidv4 } from "uuid";
import { Floor, Venue } from "../types/venue";

export const useAddFloor = (venue: Venue, setVenue: (v: Venue) => void) => {
  const index = venue.floors.length;

  return () => {
    const newFloor: Floor = {
      id: uuidv4(),
      name: `Floor ${index + 1}`,
      type: "floor",
      index,
      sections: [],
      doors: [],
      stage: {
        id: uuidv4(),
        type: "stage",
        position: { x: 100, y: 100 },
        width: 200,
        height: 100,
        fill: "#222",
        draggable: true,
        label: "Main Stage",
        fontSize: 14,
      },
      walls: [],
      lights: [],
      controlRoom: {
        id: uuidv4(),
        type: "controlRoom",
        position: { x: 50, y: 50 },
        width: 100,
        height: 60,
        fill: "#666",
        label: "Control Room",
        fontSize: 12,
        draggable: true,
      },
    };

    const updatedVenue = {
      ...venue,
      floors: [...venue.floors, newFloor],
    };

    setVenue(updatedVenue);
  };
};
