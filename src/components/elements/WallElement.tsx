import { Group, Rect, Line } from "react-konva";
import { Wall } from "@/src/types/elements";
import { useState } from "react";
import { GroupWrapper } from "../common/GroupWrapper";

interface Props {
  wall: Wall;
  isSelected: boolean;
  onClick: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: {
    width?: number;
    height?: number;
    rotation?: number;
  }) => void;
}

export const WallElement = ({
  wall,
  isSelected,
  onClick,
  onDragEnd,
  onTransformEnd,
}: Props) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <GroupWrapper
      isSelected={isSelected}
      onSelect={onClick}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      draggable={wall.draggable}
      position={wall.position}
      rotation={wall.rotation ?? 0}
      elementId={wall.id}
    >
      <Rect
        width={wall.width}
        height={wall.height}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: wall.height }}
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
          points={[5 + i * 10, 0, 5 + i * 10, wall.height]}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
          dash={[2, 4]}
        />
      ))}
    </GroupWrapper>
  );
};
