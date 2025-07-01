"use client";

import { Rect, Text } from "react-konva";
import { Stage as StageType } from "@/src/types/elements";
import { useTheme } from "next-themes";
import { GroupWrapper } from "../common/GroupWrapper";

interface Props {
  stage: StageType;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: {
    width?: number;
    height?: number;
    rotation?: number;
  }) => void;
}

export const StageElement = ({
  stage,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: Props) => {
  const { theme } = useTheme();

  return (
    <GroupWrapper
      isSelected={isSelected}
      onSelect={onSelect}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      draggable={stage.draggable}
      position={stage.position}
      rotation={stage.rotation}
      elementId={stage.id}
    >
      <Rect
        width={stage.width}
        height={stage.height}
        fill={stage.fill}
        stroke="green"
      />
      <Text
        text={stage.label}
        fontSize={stage.fontSize}
        fill={theme === "dark" ? "white" : "black"}
        x={stage.width / 2 - (stage.label.length * stage.fontSize) / 4}
        y={stage.height / 2 - stage.fontSize / 2}
      />
    </GroupWrapper>
  );
};
