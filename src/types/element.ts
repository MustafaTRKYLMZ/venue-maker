export type ElementType =
  | "seat"
  | "stage"
  | "text"
  | "wall"
  | "group"
  | "multiple_seat"
  | "door"
  | "section"
  | "floor"
  | "venue"
  | "light"
  | "row"
  | "controlRoom"
  | "map_element";

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
