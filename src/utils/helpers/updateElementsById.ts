import { Venue } from "@/src/types/venue";
import { SelectedElement } from "@/src/types/element";
import { updateElementById } from "./updateElementById";

export const updateElementsById = (
  venue: Venue,
  updatedElements: SelectedElement[],
): Venue => {
  return updatedElements.reduce((accVenue, element) => {
    return updateElementById(accVenue, element);
  }, venue);
};
