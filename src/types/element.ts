import { ControlRoom, Door, Light, Stage, Wall } from "./elements";
import { Section, Seat, Venue } from "./venue";

export type ElementType =
  | "seat"
  | "stage"
  | "text"
  | "wall"
  | "group"
  | "door"
  | "section"
  | "floor"
  | "venue"
  | "light"
  | "row"
  | "controlRoom";

export type ToolType =
  | { type: "floor" }
  | { type: "section"; rows: number; cols: number }
  | { type: "row" }
  | { type: "seat" }
  | { type: "stage" }
  | { type: "light" }
  | { type: "door" }
  | { type: "wall" }
  | { type: "controlRoom" }
  | { type: "text" }
  | null;

export type SelectedElement =
  | Venue
  | Stage
  | ControlRoom
  | Door
  | Wall
  | Light
  | Section
  | Seat;
