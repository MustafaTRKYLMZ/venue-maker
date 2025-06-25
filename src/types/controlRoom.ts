import { Position } from "./position";

export type ControlRoom = {
  id: string;
  type: "controlRoom";
  label: string;
  position: Position;
  width: number;
  height: number;
};
