import React, { FC } from "react";
import { Circle, Group, Text } from "react-konva";
import { Seat as SeatType } from "@/src/types/venue";

export type SeatProps = {
  el: SeatType;
  selectedIds: string[];
  handleElementClick?: (e: any, id: string) => void;
};

export const Seat: FC<SeatProps> = ({ el, selectedIds }) => {
  const isSelected = selectedIds.includes(el.id);
  return (
    <Group x={el.position.x} y={el.position.y}>
      <Circle
        x={el.width / 2}
        y={el.height / 2}
        radius={isSelected ? el.width / 2 : 6}
        fill={isSelected ? "red" : el.fill}
        stroke={isSelected ? "blue" : "red"}
        strokeWidth={selectedIds.includes(el.id) ? 2 : 0}
      />
      {isSelected && el.text && (
        <Text
          text={el.text}
          fontSize={el.fontSize || 12}
          fill="black"
          align="center"
          verticalAlign="middle"
          width={el.width}
          height={el.height}
          offsetX={el.width / 2}
          offsetY={el.height / 2}
          x={el.width / 2}
          y={el.height / 2}
        />
      )}
    </Group>
  );
};
