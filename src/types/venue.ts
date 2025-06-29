import { BaseElement } from "./baseElement";
import { ControlRoom, Door, Light, Stage, Wall } from "./elements";

export type SeatType =
  | "standard"
  | "vip"
  | "accessible"
  | "companion"
  | "staff";

export interface Seat extends BaseElement {
  type: "seat";
  seatType: SeatType;
  price?: number;
  isAccessible?: boolean;
  isSelected?: boolean;
  isReserved?: boolean;
}

export interface Row extends BaseElement {
  type: "row";
  seats: Seat[];
}

export interface Section extends BaseElement {
  type: "section";
  rows: Row[];
}

export type Floor = {
  id: string;
  name: string;
  type: "floor";
  index: number;
  sections: Section[];
  controlRoom?: ControlRoom;
  doors: Door[];
  stage?: Stage;
  walls: Wall[];
  lights: Light[];
};

export type Venue = {
  id: string;
  type: "venue";
  name: string;
  floors: Floor[];
  createdAt: string;
  updatedAt: string;
  address?: string;
  description?: string;
  image?: string;
  capacity?: number;
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    website?: string;
  };
};
