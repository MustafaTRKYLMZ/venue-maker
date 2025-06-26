import { MapElement } from "./mapElement";
import { Position } from "./position";
import { Seat } from "./seat";

export interface Row extends MapElement {
  id: string;
  type: "row";
  name: string;
  seats: Seat[];
  position: Position;
  rotation?: number;
  color?: string;
}
