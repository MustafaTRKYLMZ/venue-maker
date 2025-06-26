import { MapElement } from "./mapElement";

export interface Wall extends MapElement {
  id: string;
  type: "wall";
  name: string;
  position: {
    x: number;
    y: number;
  };
  rotation?: number;
  width: number;
  height: number;
  color?: string;
  draggable: boolean;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  edgeCurvatures?: [number, number, number, number];
  cornerRadii?: [number, number, number, number];
  initialWidth?: number;
  initialHeight?: number;
  initialX?: number;
  initialY?: number;
  children?: Wall[];
  text?: string;
  fontSize?: number;
  draggableText?: boolean;
}
