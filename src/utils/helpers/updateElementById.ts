import { Row, Seat, Venue, Section } from "@/src/types/venue";
import { SelectedElement } from "@/src/types/element";
import { Wall, Door, Light, Stage } from "@/src/types/elements";

export const updateElementById = (
  venue: Venue,
  updatedElement: SelectedElement,
): Venue => {
  return {
    ...venue,
    floors: venue.floors.map((floor) => {
      const isElementOnThisFloor =
        floor.id === updatedElement.id ||
        floor.sections.some(
          (section) =>
            section.id === updatedElement.id ||
            section.rows?.some(
              (row) =>
                row.seats?.some((seat) => seat.id === updatedElement.id) ||
                row.id === updatedElement.id,
            ),
        ) ||
        floor.walls.some((w) => w.id === updatedElement.id) ||
        floor.doors.some((d) => d.id === updatedElement.id) ||
        floor.lights.some((l) => l.id === updatedElement.id) ||
        (floor.stage && floor.stage.id === updatedElement.id);

      if (!isElementOnThisFloor) return floor;

      return {
        ...floor,
        sections: floor.sections.map((section) => {
          // update section
          if (section.id === updatedElement.id) {
            return updatedElement as Section;
          }

          if (!section.rows) return section;

          return {
            ...section,
            rows: section.rows.map((row) => {
              // update seats
              if (row.seats?.some((seat) => seat.id === updatedElement.id)) {
                return {
                  ...row,
                  seats: row.seats.map((seat) =>
                    seat.id === updatedElement.id
                      ? (updatedElement as Seat)
                      : seat,
                  ),
                };
              }
              //update row
              if (row.id === updatedElement.id) {
                return updatedElement as unknown as Row;
              }

              return row;
            }),
          };
        }),

        walls: floor.walls.map((wall) =>
          wall.id === updatedElement.id ? (updatedElement as Wall) : wall,
        ),
        doors: floor.doors.map((door) =>
          door.id === updatedElement.id ? (updatedElement as Door) : door,
        ),
        lights: floor.lights.map((light) =>
          light.id === updatedElement.id ? (updatedElement as Light) : light,
        ),
        stage:
          floor.stage && floor.stage.id === updatedElement.id
            ? (updatedElement as Stage)
            : floor.stage,
      };
    }),
  };
};
