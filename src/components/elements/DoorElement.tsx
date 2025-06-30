import { Group, Rect, Line, Circle } from "react-konva";
import { Door } from "@/src/types/elements";
import { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";

interface Props {
  door: Door;
  isSelected: boolean;
  onClick: () => void;
  onDragEnd: (x: number, y: number) => void;
}

export const DoorElement = ({
  door,
  isSelected,
  onClick,
  onDragEnd,
}: Props) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Group
      x={door.position.x}
      y={door.position.y}
      draggable={isSelected && door.draggable}
      onClick={onClick}
      onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
      onMouseEnter={(e) => {
        e.target.getStage()?.container().style.setProperty("cursor", "pointer");
        setIsHover(true);
      }}
      onMouseLeave={(e) => {
        e.target.getStage()?.container().style.setProperty("cursor", "default");
        setIsHover(false);
      }}
    >
      {/* Door Panel */}
      <Rect
        width={door.width}
        height={door.height}
        fill={door.fill}
        stroke={isHover ? "#FFA500" : "orange"}
        strokeWidth={isHover ? 3 : 1}
        cornerRadius={2}
        shadowColor="rgba(0,0,0,0.2)"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 2 }}
      />

      {/* Handle (circular) */}
      <Circle
        x={door.width - 10}
        y={door.height / 2}
        radius={4}
        fill="gold"
        stroke="black"
        strokeWidth={1}
      />

      {/* Hinge line (optional visual) */}
      <Line
        points={[5, 0, 5, door.height]}
        stroke="darkgray"
        strokeWidth={1}
        dash={[4, 2]}
      />
    </Group>
  );
};
