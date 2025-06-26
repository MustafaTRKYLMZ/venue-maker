import { MapElement } from "./mapElement";
import { Position } from "./position";

export interface Stage extends MapElement {
  id: string;
  name: string;
  position: Position;
  width: number;
  height: number;
}
