import { BaseElement } from "./baseElement";

import { Venue, Floor, Section, Row, Seat } from "@/src/types/venue";

export interface Door extends BaseElement {
  type: "door";
  direction: "in" | "out";
}

export interface Light extends BaseElement {
  type: "light";
  lightType: "spot" | "flood" | "ambient";
  intensity?: number;
}

export interface Wall extends BaseElement {
  type: "wall";
}
export interface Stage extends BaseElement {
  type: "stage";
}

export interface ControlRoom extends BaseElement {
  type: "controlRoom";
}

export type VenueElement =
  | Venue
  | Floor
  | Section
  | Row
  | Seat
  | Stage
  | ControlRoom
  | Door
  | Wall
  | Light
  | BaseElement;
