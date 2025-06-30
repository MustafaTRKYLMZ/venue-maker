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
      stage: undefined,
      walls: [],
      lights: [],
      controlRoom: undefined,
    };

    const updatedVenue = {
      ...venue,
      floors: [...venue.floors, newFloor],
    };

    setVenue(updatedVenue);
  };
};
