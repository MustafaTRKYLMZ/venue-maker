import { MapElement } from "./mapElement";
import { Position } from "./position";

export interface Light extends MapElement {
  id: string;
  type: "light";
  label: string;
  position: Position;
  lightType: "spot" | "flood" | "ambient";
  intensity?: number;
}
