import { Circle } from "react-konva";
import { Light } from "@/src/types/elements";
import { useState } from "react";
import { GroupWrapper } from "../common/GroupWrapper";

interface Props {
  light: Light;
  isSelected: boolean;
  onClick: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd?: (props: {
    width?: number;
    height?: number;
    rotation?: number;
  }) => void;
}

export const LightElement = ({
  light,
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
      onTransformEnd={onTransformEnd ?? (() => {})}
      draggable={light.draggable}
      position={light.position}
      rotation={light.rotation ?? 0}
      elementId={light.id}
    >
      <Circle
        radius={light.width / 2}
        fillRadialGradientStartPoint={{ x: 0, y: 0 }}
        fillRadialGradientEndPoint={{ x: 0, y: 0 }}
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
