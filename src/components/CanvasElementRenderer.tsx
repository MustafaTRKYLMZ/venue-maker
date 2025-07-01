// components/CanvasElementsRenderer.tsx
import React from "react";
import { Circle, Group, Rect, Text } from "react-konva";
import { useMapEditor } from "../context/MapEditorContext";
import { ElementType } from "../types/element";
import { Venue } from "../types/venue";
import { StageElement } from "./elements/StageElement";
import { ControlRoomElement } from "./elements/ControlRoom";
import { DoorElement } from "./elements/DoorElement";
import { LightElement } from "./elements/LightElement";
import { WallElement } from "./elements/WallElement";
import { SectionElement } from "./elements/SectionElement";

export const CanvasElementsRenderer = () => {
  const {
    venue,
    selectedFloorId,
    setVenue,
    setSelectedElement,
    selectedElement,
  } = useMapEditor();
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

  const handleElementClick = (type: ElementType, id: string) => {
    console.log(`${type} clicked`, id);

    const floor = venue.floors.find((floor) => floor.id === selectedFloorId);
    if (!floor) return;

    const elementArray = (() => {
      switch (type) {
        case "stage":
          return floor.stage ? [floor.stage] : [];
        case "controlRoom":
          return floor.controlRoom ? [floor.controlRoom] : [];
        case "door":
          return floor.doors;
        case "wall":
          return floor.walls;
        case "light":
          return floor.lights;
        case "section":
          return floor.sections;
        case "seat":
          return floor.sections.flatMap((section) =>
            section.rows.flatMap((row) => row.seats),
          );
        default:
          return [];
      }
    })();

    const selectedElement = elementArray.find((element) => element.id === id);
    if (!selectedElement) return;

    if (
      type === "stage" ||
      type === "controlRoom" ||
      type === "door" ||
      type === "wall" ||
      type === "light" ||
      type === "section" ||
      type === "seat"
    ) {
      setSelectedElement(selectedElement);
    }
  };
  console.log("Selected Element:", selectedElement);

  const handleTransformEnd = (
    type: ElementType,
    id: string,
    newProps: { width?: number; height?: number; rotation?: number },
  ) => {
    if (!selectedFloorId) return;

    const updatedFloors = venue.floors.map((floor) => {
      if (floor.id !== selectedFloorId) return floor;

      const updateProps = (element: any) => ({
        ...element,
        ...newProps,
      });

      switch (type) {
        case "stage":
          return {
            ...floor,
            stage:
              floor.stage && floor.stage.id === id
                ? updateProps(floor.stage)
                : floor.stage,
          };

        case "controlRoom":
          return {
            ...floor,
            controlRoom:
              floor.controlRoom && floor.controlRoom.id === id
                ? updateProps(floor.controlRoom)
                : floor.controlRoom,
          };

        case "door":
          return {
            ...floor,
            doors: floor.doors.map((d) => (d.id === id ? updateProps(d) : d)),
          };

        case "wall":
          return {
            ...floor,
            walls: floor.walls.map((w) => (w.id === id ? updateProps(w) : w)),
          };

        case "light":
          return {
            ...floor,
            lights: floor.lights.map((l) => (l.id === id ? updateProps(l) : l)),
          };

        case "section":
          return {
            ...floor,
            sections: floor.sections.map((s) =>
              s.id === id ? updateProps(s) : s,
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
                  seat.id === id ? updateProps(seat) : seat,
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
        const listening = isSelected;
        return (
          <Group key={floor.id} opacity={opacity} listening={listening}>
            {/* STAGE */}
            {floor.stage && (
              <StageElement
                stage={floor.stage}
                isSelected={isSelected}
                onSelect={() => handleElementClick("stage", floor.stage!.id)}
                onDragEnd={(x: number, y: number) =>
                  handleDragEnd("stage", floor.stage!.id, x, y)
                }
                onTransformEnd={(newProps) =>
                  floor.stage &&
                  handleTransformEnd("stage", floor.stage.id, newProps)
                }
              />
            )}

            {/* CONTROL ROOM */}
            {floor.controlRoom && (
              <ControlRoomElement
                controlRoom={floor.controlRoom}
                isSelected={isSelected}
                onClick={() =>
                  floor.controlRoom &&
                  handleElementClick("controlRoom", floor.controlRoom.id)
                }
                onDragEnd={(x, y) =>
                  floor.controlRoom &&
                  handleDragEnd("controlRoom", floor.controlRoom!.id, x, y)
                }
                onTransformEnd={(newProps) =>
                  floor.controlRoom &&
                  handleTransformEnd(
                    "controlRoom",
                    floor.controlRoom.id,
                    newProps,
                  )
                }
              />
            )}

            {/* DOORS */}
            {floor.doors.map((door) => (
              <DoorElement
                key={door.id}
                door={door}
                isSelected={isSelected}
                onClick={() => handleElementClick("door", door.id)}
                onDragEnd={(x, y) => handleDragEnd("door", door.id, x, y)}
                onTransformEnd={(newProps) =>
                  door && handleTransformEnd("door", door.id, newProps)
                }
              />
            ))}

            {/* WALLS */}
            {floor.walls.map((wall) => (
              <WallElement
                key={wall.id}
                wall={wall}
                onTransformEnd={(newProps) =>
                  wall && handleTransformEnd("wall", wall.id, newProps)
                }
                isSelected={isSelected}
                onClick={() => handleElementClick("wall", wall.id)}
                onDragEnd={(x, y) => handleDragEnd("wall", wall.id, x, y)}
              />
            ))}

            {/* LIGHTS */}
            {floor.lights.map((light) => (
              <LightElement
                key={light.id}
                light={light}
                isSelected={isSelected}
                onClick={() => handleElementClick("light", light.id)}
                onDragEnd={(x, y) => handleDragEnd("light", light.id, x, y)}
                onTransformEnd={(newProps) =>
                  light && handleTransformEnd("light", light.id, newProps)
                }
              />
            ))}

            {/* SECTIONS */}
            {floor.sections.map((section) => (
              <SectionElement
                key={section.id}
                section={section}
                isSelected={isSelected}
                onClick={() => handleElementClick("section", section.id)}
                onDragEnd={(x, y) => handleDragEnd("section", section.id, x, y)}
                onSeatClick={(seatId) => handleElementClick("seat", seatId)}
                onTransformEnd={(newProps) =>
                  section && handleTransformEnd("section", section.id, newProps)
                }
              />
            ))}
          </Group>
        );
      })}
    </>
  );
};
