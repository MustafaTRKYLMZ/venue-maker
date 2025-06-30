// src/utils/helpers/deleteElementById.ts

import { Venue, Section, Row, Seat } from "@/src/types/venue";

export const deleteElementById = (venue: Venue, elementId: string): Venue => {
  return {
    ...venue,
    floors: venue.floors.map((floor) => ({
      ...floor,
      sections: floor.sections
        .map((section) => {
          if (section.id === elementId) return null;

          const updatedRows = section.rows
            ?.map((row) => {
              if (row.id === elementId) return null;

              const updatedSeats = row.seats?.filter(
                (seat) => seat.id !== elementId,
              );

              return {
                ...row,
                seats: updatedSeats,
              };
            })
            .filter(Boolean) as Row[] | undefined;

          return {
            ...section,
            rows: updatedRows,
          };
        })
        .filter(Boolean) as Section[],

      walls: floor.walls.filter((wall) => wall.id !== elementId),
      doors: floor.doors.filter((door) => door.id !== elementId),
      lights: floor.lights.filter((light) => light.id !== elementId),
      stage:
        floor.stage && floor.stage.id === elementId ? undefined : floor.stage,
    })),
  };
};
