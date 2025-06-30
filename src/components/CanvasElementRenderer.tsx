// components/CanvasElementsRenderer.tsx
import React from "react";
import { Circle, Group, Rect, Text } from "react-konva";
import { useMapEditor } from "../context/MapEditorContext";
import { ElementType } from "../types/element";
import { createRowsWithSeats } from "../utils/createRowsWithSeats";

export const CanvasElementsRenderer = () => {
  const { venue, selectedFloorId, setVenue } = useMapEditor();
  if (!selectedFloorId) return null;

  const floor = venue.floors.find((f) => f.id === selectedFloorId);
  if (!floor) return null;

  const handleDragEnd = (
    type: ElementType,
    id: string,
    newX: number,
    newY: number,
  ) => {
    if (!selectedFloorId) return;

    const updatedFloors = venue.floors.map((floor) => {
      if (floor.id !== selectedFloorId) return floor;

      switch (type) {
        case "stage":
          return {
            ...floor,
            stage: floor.stage
              ? { ...floor.stage, position: { x: newX, y: newY } }
              : undefined,
          };

        case "controlRoom":
          return {
            ...floor,
            controlRoom: floor.controlRoom
              ? { ...floor.controlRoom, position: { x: newX, y: newY } }
              : undefined,
          };

        case "door":
          return {
            ...floor,
            doors: floor.doors.map((door) =>
              door.id === id
                ? { ...door, position: { x: newX, y: newY } }
                : door,
            ),
          };

        case "wall":
          return {
            ...floor,
            walls: floor.walls.map((wall) =>
              wall.id === id
                ? { ...wall, position: { x: newX, y: newY } }
                : wall,
            ),
          };

        case "light":
          return {
            ...floor,
            lights: floor.lights.map((light) =>
              light.id === id
                ? { ...light, position: { x: newX, y: newY } }
                : light,
            ),
          };

        case "section":
          return {
            ...floor,
            sections: floor.sections.map((section) =>
              section.id === id
                ? { ...section, position: { x: newX, y: newY } }
                : section,
            ),
          };

        case "seat":
          return {
            ...floor,
            sections: floor.sections.map((section) => ({
              ...section,
              rows: section.rows.map((row) => ({
                ...row,
                seats: row.seats.map((seat) =>
                  seat.id === id
                    ? { ...seat, position: { x: newX, y: newY } }
                    : seat,
                ),
              })),
            })),
          };

        default:
          return floor;
      }
    });

    setVenue({ ...venue, floors: updatedFloors });
  };

  return (
    <>
      {venue.floors.map((floor) => {
        const isSelected = floor.id === selectedFloorId;
        const opacity = isSelected ? 1 : 0.1;
        const listening = isSelected; // interaktifliği kapatmak için
        return (
          <Group key={floor.id} opacity={opacity} listening={listening}>
            {/* STAGE */}
            {floor.stage && (
              <Group
                key={floor.stage.id}
                x={floor.stage.position.x}
                y={floor.stage.position.y}
                draggable={isSelected && floor.stage.draggable}
                onDragEnd={(e) => {
                  if (isSelected) {
                    handleDragEnd(
                      "stage",
                      floor.stage?.id || "",
                      e.target.x(),
                      e.target.y(),
                    );
                  }
                }}
              >
                <Rect
                  width={floor.stage.width}
                  height={floor.stage.height}
                  fill={floor.stage.fill}
                  stroke="green"
                />
                <Text
                  text={floor.stage.label}
                  fontSize={floor.stage.fontSize}
                  fill="black"
                  x={
                    floor.stage.width / 2 -
                    (floor.stage.label.length * floor.stage.fontSize) / 4
                  }
                  y={floor.stage.height / 2 - floor.stage.fontSize / 2}
                />
              </Group>
            )}

            {/* CONTROL ROOM */}
            {floor.controlRoom && (
              <Group
                key={floor.controlRoom.id}
                x={floor.controlRoom.position.x}
                y={floor.controlRoom.position.y}
                draggable={isSelected && floor.controlRoom.draggable}
                onDragEnd={(e) => {
                  if (isSelected) {
                    handleDragEnd(
                      "controlRoom",
                      floor.controlRoom?.id || "",
                      e.target.x(),
                      e.target.y(),
                    );
                  }
                }}
              >
                <Rect
                  width={floor.controlRoom.width}
                  height={floor.controlRoom.height}
                  fill={floor.controlRoom.fill}
                  stroke="purple"
                />
                <Text
                  text={floor.controlRoom.label}
                  fontSize={floor.controlRoom.fontSize}
                  fill="black"
                  x={
                    floor.controlRoom.width / 2 -
                    (floor.controlRoom.label.length *
                      floor.controlRoom.fontSize) /
                      4
                  }
                  y={
                    floor.controlRoom.height / 2 -
                    floor.controlRoom.fontSize / 2
                  }
                />
              </Group>
            )}

            {/* DOORS */}
            {floor.doors.map((door) => (
              <Group
                key={door.id}
                x={door.position.x}
                y={door.position.y}
                draggable={isSelected && door.draggable}
                onDragEnd={(e) =>
                  isSelected &&
                  handleDragEnd("door", door.id, e.target.x(), e.target.y())
                }
              >
                <Rect
                  width={door.width}
                  height={door.height}
                  fill={door.fill}
                  stroke="orange"
                />
              </Group>
            ))}

            {/* WALLS */}
            {floor.walls.map((wall) => (
              <Group
                key={wall.id}
                x={wall.position.x}
                y={wall.position.y}
                draggable={isSelected && wall.draggable}
                onDragEnd={(e) =>
                  isSelected &&
                  handleDragEnd("wall", wall.id, e.target.x(), e.target.y())
                }
              >
                <Rect
                  width={wall.width}
                  height={wall.height}
                  fill={wall.fill}
                  stroke="gray"
                />
              </Group>
            ))}

            {/* LIGHTS */}
            {floor.lights.map((light) => (
              <Group
                key={light.id}
                x={light.position.x}
                y={light.position.y}
                draggable={isSelected && light.draggable}
                onDragEnd={(e) =>
                  isSelected &&
                  handleDragEnd("light", light.id, e.target.x(), e.target.y())
                }
              >
                <Circle
                  radius={light.width / 2}
                  x={light.position.x}
                  y={light.position.y}
                  fill={light.fill}
                  stroke="yellow"
                />
              </Group>
            ))}

            {/* SECTIONS */}
            {floor.sections.map((section) => (
              <Group
                key={section.id}
                x={section.position.x}
                y={section.position.y}
                draggable={isSelected && section.draggable}
                onDragEnd={(e) =>
                  isSelected &&
                  handleDragEnd(
                    "section",
                    section.id,
                    e.target.x(),
                    e.target.y(),
                  )
                }
              >
                <Rect
                  width={section.width}
                  height={section.height}
                  fill={section.fill}
                  stroke="blue"
                />
                {section.rows.map((row) => (
                  <Group
                    key={row.id}
                    x={row.position.x}
                    y={row.position.y}
                    draggable={isSelected && row.draggable}
                    onDragEnd={(e) =>
                      isSelected &&
                      handleDragEnd("row", row.id, e.target.x(), e.target.y())
                    }
                  >
                    <Rect
                      width={row.width}
                      height={row.height}
                      fill={row.fill}
                      stroke="yellow"
                    />
                    {row.seats.map((seat) => (
                      <Circle
                        key={seat.id}
                        x={seat.position.x + seat.width / 2}
                        y={seat.position.y + seat.height / 2}
                        radius={seat.width / 2}
                        fill={seat.fill}
                        stroke="red"
                        draggable={isSelected && seat.draggable}
                        onDragEnd={(e) =>
                          isSelected &&
                          handleDragEnd(
                            "seat",
                            seat.id,
                            e.target.x(),
                            e.target.y(),
                          )
                        }
                      />
                    ))}
                  </Group>
                ))}
              </Group>
            ))}
          </Group>
        );
      })}
    </>
  );
};
