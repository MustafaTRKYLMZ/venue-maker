// components/canvas/elements/ControlRoomElement.tsx
import { Group, Rect, Text } from "react-konva";
import { ControlRoom } from "@/src/types/elements";
import { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";

interface Props {
  controlRoom: ControlRoom;
  isSelected: boolean;
  onClick: () => void;
  onDragEnd: (x: number, y: number) => void;
}

export const ControlRoomElement = ({
  controlRoom,
  isSelected,
  onClick,
  onDragEnd,
}: Props) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Group
      x={controlRoom.position.x}
      y={controlRoom.position.y}
      draggable={isSelected && controlRoom.draggable}
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
      <Rect
        width={controlRoom.width}
        height={controlRoom.height}
        fill={isHover ? "#9b59b6" : controlRoom.fill}
        stroke="purple"
      />
      <Text
        text={controlRoom.label}
        fontSize={controlRoom.fontSize}
        fill="black"
        x={
          controlRoom.width / 2 -
          (controlRoom.label.length * controlRoom.fontSize) / 4
        }
        y={controlRoom.height / 2 - controlRoom.fontSize / 2}
      />
    </Group>
  );
};
