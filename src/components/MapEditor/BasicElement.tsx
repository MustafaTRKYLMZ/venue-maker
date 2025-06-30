import { BaseElement } from "@/src/types/baseElement";
import { ControlRoom, Door, Light, Wall } from "@/src/types/elements";
import { Venue } from "@/src/types/venue";
import Konva from "konva";
import { Stage } from "konva/lib/Stage";

import React, { FC } from "react";
import { Group, Rect, Text } from "react-konva";

export type BasicElementProps = {
  el: BaseElement | Stage | ControlRoom | Door | Light | Wall;
  selectedIds: string[];
  elementRefs: React.MutableRefObject<Record<string, Konva.Node | null>>;
  handleElementClick: (e: any, id: string) => void;
  setElements: (updater: (prev: Venue[]) => Venue[]) => void;
  handleTransformEnd: (id: string, node: Konva.Node) => void;
};

export const BasicElement: FC<BasicElementProps> = ({
  el,
  selectedIds,
  elementRefs,
  handleElementClick,
  setElements,
  handleTransformEnd,
}) => {
  if (!el.position) return null;

  const { id, width, height, fill, position, label, fontSize } = el;

  return (
    <Group
      x={position.x}
      y={position.y}
      draggable
      ref={(node) => {
        if (node) {
          elementRefs.current[id] = node;
        }
      }}
      onClick={(e) => handleElementClick(e, id)}
      onTransformEnd={() => {
        const node = elementRefs.current[id];
        if (node) handleTransformEnd(id, node);
      }}
      onDragEnd={(e) => {
        const node = e.target;
        setElements((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  position: { x: node.x(), y: node.y() },
                }
              : item,
          ),
        );
      }}
    >
      <Rect
        width={width}
        height={height}
        fill={fill ?? "transparent"}
        stroke={selectedIds.includes(id) ? "blue" : undefined}
        strokeWidth={selectedIds.includes(id) ? 2 : 0}
      />
      {label && (
        <Text
          text={label}
          fontSize={fontSize || 16}
          fill="black"
          width={width}
          height={height}
          align="center"
          verticalAlign="middle"
        />
      )}
    </Group>
  );
};
