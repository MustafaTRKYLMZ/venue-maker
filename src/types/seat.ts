import { MapElement } from "./mapElement";
import { Position } from "./position";

export type SeatType =
  | "standard"
  | "vip"
  | "accessible"
  | "companion"
  | "staff";

export interface Seat extends MapElement {
  id: string;
  label: string;
  type: "seat";
  seatType: SeatType;
  price?: number;
  position: Position;
  color?: string;
  isAccessible?: boolean;
}
