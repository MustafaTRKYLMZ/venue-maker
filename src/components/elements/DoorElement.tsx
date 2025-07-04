import { Rect, Line, Circle } from "react-konva";
import { Door } from "@/src/types/elements";
import { useState } from "react";
import { GroupWrapper } from "../common/GroupWrapper";

interface Props {
  door: Door;
  isParentSelected: boolean;
  onClick: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd?: (props: {
    width?: number;
    height?: number;
    rotation?: number;
    position?: { x: number; y: number };
  }) => void;
  width?: number; // GroupWrapper'dan geliyor
  height?: number; // GroupWrapper'dan geliyor
  rotation?: number; // GroupWrapper'dan geliyor
}

export const DoorElement = ({
  door,
  isParentSelected,
  onClick,
  onDragEnd,
  onTransformEnd,
  width,
  height,
  rotation,
}: Props) => {
  const [isHover, setIsHover] = useState(false);

  const w = width ?? door.width;
  const h = height ?? door.height;

  return (
    <GroupWrapper
      element={door}
      isParentSelected={isParentSelected}
      onSelect={onClick}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd ?? (() => {})}
      draggable={door.draggable && isParentSelected}
    >
      <Rect
        width={w}
        height={h}
        fill={door.fill}
        stroke={isHover ? "#FFA500" : "orange"}
        strokeWidth={isHover ? 3 : 1}
        cornerRadius={2}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 2 }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      />
      <Circle
        x={door.width - 10}
        y={door.height / 2}
        radius={4}
        fill={"gold"}
        stroke="black"
        strokeWidth={1}
      />
      <Line
        points={[5, 0, 5, h]}
        stroke="darkgray"
        strokeWidth={1}
        dash={[4, 2]}
        rotation={rotation}
      />
    </GroupWrapper>
  );
};
