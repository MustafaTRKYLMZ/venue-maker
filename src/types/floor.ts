import { ControlRoom } from "./controlRoom";
import { Section } from "./section";

export type Floor = {
  id: string;
  type: "floor";
  name: string;
  index: number;
  sections: Section[];
  controlRoom?: ControlRoom;
};
