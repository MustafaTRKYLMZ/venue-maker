import { GroupEdgeBends } from "@/src/types/groupEdgeBends";
import React, { FC } from "react";
import { Circle } from "react-konva";

export type EdgeBendControlsProps = {
  el: { width: number; height: number };
  groupEdgeBends: GroupEdgeBends;
  setGroupEdgeBends: React.Dispatch<
    React.SetStateAction<{
      top: number;
      right: number;
      bottom: number;
      left: number;
    }>
  >;
  pos?: { x: number; y: number };
};

export const EdgeBendControls: FC<EdgeBendControlsProps> = ({
  el,
  groupEdgeBends,
  setGroupEdgeBends,
}) => {
  const { width, height } = el;
  return (
    <>
      {/* Top */}
      <Circle
        key="bend-top"
        x={width / 2}
        y={groupEdgeBends.top}
        radius={8}
        fill="red"
        draggable
        dragBoundFunc={(pos) => {
          const minY = -height;
          const maxY = height;
          const y = Math.min(Math.max(pos.y, minY), maxY);
          return { x: width / 2, y };
        }}
        onDragMove={(e) => {
          const y = e.target.y();
          setGroupEdgeBends((prev) => ({ ...prev, top: y }));
          e.target.x(el.width / 2);
        }}
      />

      {/* Right */}
      <Circle
        key="bend-right"
        x={width + groupEdgeBends.right}
        y={height / 2}
        radius={8}
        fill="red"
        draggable
        dragBoundFunc={(pos) => {
          const minX = width - width;
          const maxX = width + width;
          const x = Math.min(Math.max(pos.x, minX), maxX);
          return { x, y: height / 2 };
        }}
        onDragMove={(e) => {
          const x = e.target.x();
          setGroupEdgeBends((prev) => ({ ...prev, right: x - el.width }));
          e.target.y(el.height / 2); // Y sabitleniyor
        }}
      />

      {/* Bottom */}
      <Circle
        key="bend-bottom"
        x={width / 2}
        y={height + groupEdgeBends.bottom}
        radius={8}
        fill="red"
        draggable
        dragBoundFunc={(pos) => {
          const minY = height - height;
          const maxY = height + height;
          const y = Math.min(Math.max(pos.y, minY), maxY);
          return { x: width / 2, y };
        }}
        onDragMove={(e) => {
          const y = e.target.y();
          setGroupEdgeBends((prev) => ({ ...prev, bottom: y - height }));
          e.target.x(width / 2); // X sabit
        }}
      />

      {/* Left */}
      <Circle
        key="bend-left"
        x={groupEdgeBends.left}
        y={height / 2}
        radius={8}
        fill="red"
        draggable
        dragBoundFunc={(pos) => {
          const minX = -width;
          const maxX = width;
          const x = Math.min(Math.max(pos.x, minX), maxX);
          return { x, y: height / 2 };
        }}
        onDragMove={(e) => {
          const x = e.target.x();
          setGroupEdgeBends((prev) => ({ ...prev, left: x }));
          e.target.y(height / 2);
        }}
      />
    </>
  );
};
