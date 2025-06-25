import { Position } from "./position";

export type Light = {
  id: string;
  type: "light";
  label: string;
  position: Position;
  lightType: "spot" | "flood" | "ambient";
  intensity?: number;
};
