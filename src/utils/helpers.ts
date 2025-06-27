import { BaseElement } from "@/src/types/baseElement";
import { GroupEdgeBends } from "../types/groupEdgeBends";

export const applyEdgeBendsToChild = <T extends BaseElement>(
  child: T,
  el: BaseElement,
  groupEdgeBends: GroupEdgeBends,
): T => {
  const { x: relX, y: relY } = child.position;
  const { width: w, height: h } = el;

  const midX = w / 2;
  const midY = h / 2;

  const curve = (t: number) => 1 - Math.pow(t, 4);

  const dx =
    (groupEdgeBends.left + groupEdgeBends.right) *
    curve((relY - midY) / midY) *
    0.3;
  const dy =
    (groupEdgeBends.top + groupEdgeBends.bottom) *
    curve((relX - midX) / midX) *
    0.3;

  return {
    ...child,
    position: {
      ...child.position,
      x: relX + dx,
      y: relY + dy,
    },
  };
};

export const getElementBounds = (el: BaseElement) => ({
  x1: el.position.x,
  y1: el.position.y,
  x2: el.position.x + el.width,
  y2: el.position.y + el.height,
});

export type drawBentGroupShapeProps = {
  ctx: CanvasRenderingContext2D;
  isSelected?: boolean;
  el: BaseElement;
  b: GroupEdgeBends;
};
export const drawBentGroupShape = ({
  ctx,
  b,
  isSelected,
  el,
}: drawBentGroupShapeProps) => {
  const w = el.width;
  const h = el.height;

  const offsetX = Math.max(0, -b.left);
  const offsetY = Math.max(0, -b.top);

  ctx.beginPath();

  ctx.moveTo(offsetX, offsetY);
  ctx.quadraticCurveTo(offsetX + w / 2, offsetY + b.top, offsetX + w, offsetY);
  ctx.quadraticCurveTo(
    offsetX + w + b.right,
    offsetY + h / 2,
    offsetX + w,
    offsetY + h,
  );
  ctx.quadraticCurveTo(
    offsetX + w / 2,
    offsetY + h + b.bottom,
    offsetX,
    offsetY + h,
  );
  ctx.quadraticCurveTo(offsetX + b.left, offsetY + h / 2, offsetX, offsetY);

  ctx.closePath();

  ctx.fillStyle = el.fill || "transparent";
  ctx.fill();

  ctx.strokeStyle = isSelected ? "blue" : "gray";
  ctx.lineWidth = isSelected ? 2 : 1;
  ctx.stroke();
};
