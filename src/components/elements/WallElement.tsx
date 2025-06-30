import { Group, Rect, Line } from "react-konva";
import { Wall } from "@/src/types/elements";
import { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";

interface Props {
  wall: Wall;
  isSelected: boolean;
  onClick: () => void;
  onDragEnd: (x: number, y: number) => void;
}

export const WallElement = ({
  wall,
  isSelected,
  onClick,
  onDragEnd,
}: Props) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Group
      x={wall.position.x}
      y={wall.position.y}
      draggable={isSelected && wall.draggable}
      onClick={onClick}
      onDragEnd={(e: KonvaEventObject<Event>) =>
        onDragEnd(e.target.x(), e.target.y())
      }
      onMouseEnter={(e) => {
        e.target.getStage()?.container().style.setProperty("cursor", "pointer");
        setIsHover(true);
      }}
      onMouseLeave={(e) => {
        e.target.getStage()?.container().style.setProperty("cursor", "default");
        setIsHover(false);
      }}
    >
      {/* Wall base with subtle gradient */}
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
      />

      {/* Optional texture lines */}
      {[...Array(5)].map((_, i) => (
        <Line
          key={i}
          points={[5 + i * 10, 0, 5 + i * 10, wall.height]}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
          dash={[2, 4]}
        />
      ))}
    </Group>
  );
};
