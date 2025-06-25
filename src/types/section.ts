import { Position } from "./position";
import { Seat } from "./seat";

export type Section = {
  id: string;
  type: "section";
  name: string;
  seats: Seat[];
  position: Position;
  rotation?: number;
  color?: string;
};
