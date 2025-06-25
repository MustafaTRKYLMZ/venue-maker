import { Position } from "./position";

export type SeatType =
  | "standard"
  | "vip"
  | "accessible"
  | "companion"
  | "staff";

export type Seat = {
  id: string;
  label: string;
  type: "seat";
  seatType: SeatType;
  price?: number;
  position: Position;
  color?: string;
  isAccessible?: boolean;
};
