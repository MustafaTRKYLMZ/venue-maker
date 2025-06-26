import { MapElement } from "./mapElement";
import { Position } from "./position";

export interface ControlRoom extends MapElement {
  id: string;
  type: "control_room";
  label: string;
  position: Position;
  width: number;
  height: number;
}
