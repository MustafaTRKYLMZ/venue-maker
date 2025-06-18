// types/mapElement.ts
import { ElementType } from "./element";

export interface MapElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string; // Fill is optional for group
  draggable: boolean;
  text?: string;
  fontSize?: number;
  rotation?: number;
  stroke?: string;
  strokeWidth?: number;
  children?: MapElement[]; // NEW: For group elements
}
