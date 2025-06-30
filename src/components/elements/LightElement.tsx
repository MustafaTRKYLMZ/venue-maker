import { Circle } from "react-konva";
import { Light } from "@/src/types/elements";
import { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";

interface Props {
  light: Light;
  isSelected: boolean;
  onClick: () => void;
  onDragEnd: (x: number, y: number) => void;
}

export const LightElement = ({
  light,
  isSelected,
  onClick,
  onDragEnd,
}: Props) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Circle
      x={light.position.x}
      y={light.position.y}
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
      draggable={isSelected && light.draggable}
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
    />
  );
};
