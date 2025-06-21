// types/mapElement.ts
import { ElementType } from "./element"; // Make sure this path is correct

export interface MapElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  draggable: boolean;
  text?: string;
  fontSize?: number;
  rotation?: number;
  stroke?: string;
  strokeWidth?: number;

  children?: MapElement[]; 
  edgeCurvatures?: [number, number, number, number]; 
  cornerRadii?: [number, number, number, number]; 

  initialWidth?: number; 
  initialHeight?: number; 
  initialX?: number;
  initialY?: number;
}