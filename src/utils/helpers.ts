import { MapElement } from "@/src/types/mapElement";
import { GroupEdgeBends } from "../types/groupEdgeBends";

export const applyEdgeBendsToChild = (
  child: MapElement,
  group: MapElement,
  bends: GroupEdgeBends,
): { x: number; y: number } => {
  let newX = child.x;
  let newY = child.y;

  const relX = child.x;
  const relY = child.y;
  const w = group.width;
  const h = group.height;

  const topEffect = bends.top * (1 - Math.abs(relX - w / 2) / (w / 2));
  const rightEffect = bends.right * (1 - Math.abs(relY - h / 2) / (h / 2));
  const bottomEffect = bends.bottom * (1 - Math.abs(relX - w / 2) / (w / 2));
  const leftEffect = bends.left * (1 - Math.abs(relY - h / 2) / (h / 2));

  newX += rightEffect + leftEffect;
  newY += topEffect + bottomEffect;

  return { x: newX, y: newY };
};

export const getElementBounds = (el: MapElement) => ({
  x1: el.x,
  y1: el.y,
  x2: el.x + el.width,
  y2: el.y + el.height,
});
