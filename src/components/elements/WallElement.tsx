import { Rect, Line } from "react-konva";
import { Wall } from "@/src/types/elements";
import { useState } from "react";
import { GroupWrapper } from "../common/GroupWrapper";

interface Props {
  wall: Wall;
  isParentSelected: boolean;
  onClick: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: {
    width?: number;
    height?: number;
    rotation?: number;
  }) => void;
  width?: number;
  height?: number;
  rotation?: number;
}

export const WallElement = ({
  wall,
  isParentSelected,
  onClick,
  onDragEnd,
  onTransformEnd,
  width,
  height,
}: Props) => {
  const [isHover, setIsHover] = useState(false);

  const w = width ?? wall.width;
  const h = height ?? wall.height;

  return (
    <GroupWrapper
      element={wall}
      isParentSelected={isParentSelected}
      onSelect={onClick}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      draggable={wall.draggable && isParentSelected}
    >
      <Rect
        width={w}
        height={h}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: h }}
        fillLinearGradientColorStops={[0, "#d0d0d0", 1, "#a0a0a0"]}
        stroke={isHover ? "#555555" : "#888888"}
        strokeWidth={isHover ? 3 : 2}
        cornerRadius={2}
        shadowColor="rgba(0,0,0,0.15)"
        shadowBlur={6}
        shadowOffset={{ x: 1, y: 2 }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      />

      {[...Array(5)].map((_, i) => (
        <Line
          key={i}
          points={[5 + i * 10, 0, 5 + i * 10, h]}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
          dash={[2, 4]}
        />
      ))}
    </GroupWrapper>
  );
};
