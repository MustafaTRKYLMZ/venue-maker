import { Circle } from "react-konva";
import { Light } from "@/src/types/elements";
import { useState } from "react";
import { GroupWrapper } from "../common/GroupWrapper";
import { KonvaEventObject } from "konva/lib/Node";

interface Props {
  light: Light;
  isParentSelected: boolean;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd?: (props: {
    width?: number;
    height?: number;
    rotation?: number;
  }) => void;
  width?: number;
  height?: number;
}

export const LightElement = ({
  light,
  isParentSelected,
  onClick,
  onDragEnd,
  onTransformEnd,
  width,
}: Props) => {
  const [isHover, setIsHover] = useState(false);
  const w = width ?? light.width;
  return (
    <GroupWrapper
      element={light}
      isParentSelected={isParentSelected}
      onSelect={onClick}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd ?? (() => {})}
      draggable={light.draggable && isParentSelected}
    >
      <Circle
        radius={w / 2}
        fillRadialGradientStartPoint={{ x: 0, y: 0 }}
        fillRadialGradientEndPoint={{ x: w / 2, y: w / 2 }}
        fillRadialGradientColorStops={[
          0,
          isHover ? "rgba(255, 255, 100, 0.9)" : "rgba(255, 255, 150, 0.7)",
          0.5,
          "rgba(255, 255, 100, 0.4)",
          1,
          "rgba(255, 255, 0, 0)",
        ]}
        stroke={isHover ? "#fff966" : "#ffeb3b"}
        strokeWidth={isHover ? 3 : 1}
        shadowColor="yellow"
        shadowBlur={isHover ? 20 : 10}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      />
    </GroupWrapper>
  );
};
