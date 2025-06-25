import { Position } from "./position";

export type Door = {
  id: string;
  type: "door";
  label: string;
  position: Position;
  direction: "in" | "out";
};
