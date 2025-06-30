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
          const y = Math.min(Math.max(pos.y, -height), height);
          return { x: width / 2, y };
        }}
        onDragMove={(e) => {
          const y = e.target.y();
          setGroupEdgeBends((prev) => ({
            ...prev,
            top: y,
            bottom: y,
          }));
          e.target.x(width / 2);
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
          const y = Math.min(Math.max(pos.y, 0), height * 2);
          return { x: width / 2, y };
        }}
        onDragMove={(e) => {
          const y = e.target.y();
          const val = y - height;
          setGroupEdgeBends((prev) => ({
            ...prev,
            bottom: val,
            top: val,
          }));
          e.target.x(width / 2);
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
          const x = Math.min(Math.max(pos.x, 0), width * 2);
          return { x, y: height / 2 };
        }}
        onDragMove={(e) => {
          const x = e.target.x();
          const val = x - width;
          setGroupEdgeBends((prev) => ({
            ...prev,
            right: val,
            left: val,
          }));
          e.target.y(height / 2);
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
          const x = Math.min(Math.max(pos.x, -width), width);
          return { x, y: height / 2 };
        }}
        onDragMove={(e) => {
          const x = e.target.x();
          setGroupEdgeBends((prev) => ({
            ...prev,
            left: x,
            right: x,
          }));
          e.target.y(height / 2);
        }}
      />
    </>
  );
};
