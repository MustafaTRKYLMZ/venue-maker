import { Rect, Text } from "react-konva";
import { ControlRoom } from "@/src/types/elements";
import { useState } from "react";
import { GroupWrapper } from "../common/GroupWrapper";
import { KonvaEventObject } from "konva/lib/Node";

interface Props {
  controlRoom: ControlRoom;
  isParentSelected: boolean;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: {
    width?: number;
    height?: number;
    rotation?: number;
  }) => void;
}

export const ControlRoomElement = ({
  controlRoom,
  isParentSelected,
  onClick,
  onDragEnd,
  onTransformEnd,
}: Props) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <GroupWrapper
      element={controlRoom}
      isParentSelected={isParentSelected}
      onSelect={onClick}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      draggable={controlRoom.draggable}
    >
      <Rect
        width={controlRoom.width}
        height={controlRoom.height}
        fill={isHover ? "#9b59b6" : controlRoom.fill}
        stroke="purple"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
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
    </GroupWrapper>
  );
};
