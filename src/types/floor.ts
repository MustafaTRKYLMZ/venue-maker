import { ControlRoom } from "./controlRoom";
import { Door } from "./door";
import { MapElement } from "./mapElement";
import { Section } from "./section";
import { Wall } from "./wall";

export interface Floor extends MapElement {
  id: string;
  type: "floor";
  name: string;
  index: number;
  sections: Section[];
  controlRoom?: ControlRoom;
  doors?: Door[];
  width: number;
  height: number;
  wall?: Wall;
}
