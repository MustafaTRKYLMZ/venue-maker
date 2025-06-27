// types/baseElement.ts
import { ElementType } from "./element";

export type Position = {
  x: number;
  y: number;
  row?: number;
  col?: number;
};

export interface BaseElement {
  id: string;
  type: ElementType;
  position: Position;
  label: string;
  width: number;
  height: number;
  fill: string;
  draggable: boolean;
  text?: string;
  fontSize: number;
  rotation?: number;
  stroke?: string;
  strokeWidth?: number;

  edgeCurvatures?: [number, number, number, number];
  cornerRadii?: [number, number, number, number];

  initialWidth?: number;
  initialHeight?: number;
  initialX?: number;
  initialY?: number;
}
