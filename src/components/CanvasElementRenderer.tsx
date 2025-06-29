// components/CanvasElementsRenderer.tsx
import React from "react";
import { Circle, Group, Rect } from "react-konva";
import { useMapEditor } from "../context/MapEditorContext";

export const CanvasElementsRenderer = () => {
  const { venue, selectedFloorId } = useMapEditor();
  if (!selectedFloorId) return null;

  const floor = venue.floors.find((f) => f.id === selectedFloorId);
  if (!floor) return null;

  return (
    <>
      {floor.sections?.map((section) => (
        <Group
          key={section.id}
          x={section.position.x}
          y={section.position.y}
          draggable={section.draggable}
        >
          <Rect
            width={section.width}
            height={section.height}
            fill={section.fill}
            stroke="blue"
            strokeWidth={1}
          />
          {section.rows.map((row) => (
            <Group
              key={row.id}
              x={row.position.x - section.position.x}
              y={row.position.y - section.position.y}
              draggable={row.draggable}
            >
              <Rect
                width={row.width}
                height={row.height}
                fill={row.fill}
                stroke="yellow"
                strokeWidth={0.5}
              />
              {row.seats.map((seat) => (
                <Circle
                  key={seat.id}
                  x={seat.position.x + seat.width / 2}
                  y={seat.position.y + seat.height / 2}
                  radius={seat.width / 2}
                  fill={seat.fill}
                  stroke="red"
                  strokeWidth={0.5}
                  draggable={seat.draggable}
                />
              ))}
            </Group>
          ))}
        </Group>
      ))}
    </>
  );
};
