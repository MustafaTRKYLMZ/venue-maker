import React, { FC } from "react";
import { Circle, Text } from "react-konva";
import { MapElement } from "../../types/mapElement";

export type SeatProps = {
  el: MapElement;
  selectedIds: string[];
};

export const Seat: FC<SeatProps> = ({ el, selectedIds }) => {
  return (
    <>
      <Circle
        x={el.width / 2}
        y={el.height / 2}
        radius={el.width / 2}
        fill={el.fill}
        stroke={selectedIds.includes(el.id) ? "blue" : undefined}
        strokeWidth={selectedIds.includes(el.id) ? 2 : 0}
      />
      {el.text && (
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
    </>
  );
};
