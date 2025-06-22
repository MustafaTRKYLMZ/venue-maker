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
  return (
    <>
      <Circle
        key="bend-top"
        x={el.width / 2}
        y={groupEdgeBends.top}
        radius={8}
        fill="red"
        draggable
        dragBoundFunc={(pos) => {
          const minY = -el.height / 2;
          const maxY = el.height / 2;
          let y = Math.min(Math.max(pos.y, minY), maxY);
          return { x: el.width / 2, y };
        }}
        onDragMove={(e) => {
          const pos = e.target.position();
          setGroupEdgeBends((prev) => ({ ...prev, top: pos.y }));
        }}
      />

      {/* right-center */}
      <Circle
        key="bend-right"
        x={el.width + groupEdgeBends.right}
        y={el.height / 2}
        radius={8}
        fill="red"
        draggable
        dragBoundFunc={(pos) => {
          const minX = el.width / 2;
          const maxX = el.width * 1.5;
          let x = Math.min(Math.max(pos.x, minX), maxX);
          return { x, y: el.height / 2 };
        }}
        onDragMove={(e) => {
          const pos = e.target.position();
          setGroupEdgeBends((prev) => ({ ...prev, right: pos.x - el.width }));
        }}
      />

      {/* bottom-center */}
      <Circle
        key="bend-bottom"
        x={el.width / 2}
        y={el.height + groupEdgeBends.bottom}
        radius={8}
        fill="red"
        draggable
        dragBoundFunc={(pos) => {
          const minY = el.height / 2;
          const maxY = el.height * 1.5;
          let y = Math.min(Math.max(pos.y, minY), maxY);
          return { x: el.width / 2, y };
        }}
        onDragMove={(e) => {
          const pos = e.target.position();
          setGroupEdgeBends((prev) => ({
            ...prev,
            bottom: pos.y - el.height,
          }));
        }}
      />

      {/* left-center  */}
      <Circle
        key="bend-left"
        x={groupEdgeBends.left}
        y={el.height / 2}
        radius={8}
        fill="red"
        draggable
        dragBoundFunc={(pos) => {
          const minX = -el.width / 2;
          const maxX = el.width / 2;
          let x = Math.min(Math.max(pos.x, minX), maxX);
          return { x, y: el.height / 2 };
        }}
        onDragMove={(e) => {
          const pos = e.target.position();
          setGroupEdgeBends((prev) => ({ ...prev, left: pos.x }));
        }}
      />
    </>
  );
};
