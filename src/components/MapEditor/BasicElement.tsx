import { MapElement } from "@/src/types/mapElement";
import React, { FC } from "react";
import { Rect, Text } from "react-konva";

export type BasicElementProps = {
  el: MapElement;
  selectedIds: string[];
};

export const BasicElement: FC<BasicElementProps> = ({ el, selectedIds }) => {
  return (
    <>
      <Rect
        width={el.width}
        height={el.height}
        fill={el.fill}
        stroke={selectedIds.includes(el.id) ? "blue" : undefined}
        strokeWidth={selectedIds.includes(el.id) ? 2 : 0}
      />
      {el.text && (
        <Text
          text={el.text}
          fontSize={el.fontSize || 16}
          fill="black"
          width={el.width}
          height={el.height}
          align="center"
          verticalAlign="middle"
        />
      )}
    </>
  );
};
