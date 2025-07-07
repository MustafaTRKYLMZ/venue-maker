import { BaseElement } from "./baseElement";
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
  | "controlRoom"
  | "hand"
  | "none";

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
  | { type: "hand" }
  | { type: "none" }
  | null;

export type SelectedElement =
  | Stage
  | ControlRoom
  | Door
  | Wall
  | Light
  | Section
  | Seat
  | BaseElement;
