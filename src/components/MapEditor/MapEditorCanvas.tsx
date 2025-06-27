"use client";

import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Group } from "react-konva";
import Konva from "konva";
import { ElementType } from "@/src/types/element";
import { KonvaEventObject } from "konva/lib/Node";
import { BasicElement } from "./BasicElement";
import { SelectionRect } from "./SelectionRect";
import { CustomTransformer } from "./CustomTransformer";
import { GroupEdgeBends } from "@/src/types/groupEdgeBends";
import {
  Floor as FloorType,
  Section as SectionType,
  Venue,
} from "@/src/types/venue";
import { Door, Light, VenueElement } from "@/src/types/elements";
import { ToolType } from "@/src/app/editor/[mapId]/page";
import { Floor } from "./Floor";

type MapEditorCanvasProps = {
  width: number;
  height: number;
  venue: Venue;
  setElements: React.Dispatch<React.SetStateAction<Venue[]>>;
  selectedIds: string[];
  onSelectElements: (venue: Venue[]) => void;
  selectedTool: ToolType | null;
  addElementAtPosition: (
    type: string,
    position: { x: number; y: number },
  ) => void;
  setSelectedTool: (tool: ToolType | null) => void;
  addSeatsGrid: (
    position: { x: number; y: number },
    rows: number,
    cols: number,
  ) => void;
};

export const MapEditorCanvas: React.FC<MapEditorCanvasProps> = ({
  width,
  height,
  venue,
  setElements,
  selectedIds,
  onSelectElements,
  selectedTool,
  addElementAtPosition,
  setSelectedTool,
  addSeatsGrid,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectionVisible, setSelectionVisible] = useState(false);
  const elementRefs = useRef<Record<string, Konva.Node>>({});
  const [groupEdgeBends, setGroupEdgeBends] = useState<GroupEdgeBends>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const isGroupId = (id: string) => {
    const el = venue.floors?.find((el) => el.id === id);
    return (
      el?.type === "floor" &&
      el.sections?.some((section) => section.type === "section")
    );
  };

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    requestAnimationFrame(() => {
      if (selectedIds.length === 0) {
        transformer.nodes([]);
        transformer.getLayer()?.batchDraw();
        return;
      }

      const groupId = selectedIds.find((id) => isGroupId(id));
      if (groupId) {
        const groupNode = elementRefs.current[groupId];
        if (groupNode) {
          transformer.nodes([groupNode]);
          transformer.getLayer()?.batchDraw();
          return;
        }
      }

      const selectedNodes = selectedIds
        .map((id) => elementRefs.current[id])
        .filter(Boolean);

      transformer.nodes(selectedNodes);
      transformer.getLayer()?.batchDraw();
    });
  }, [selectedIds, venue]);

  const isInside = (a: any, b: any) =>
    a.x1 >= b.x1 && a.y1 >= b.y1 && a.x2 <= b.x2 && a.y2 <= b.y2;

  const getElementBounds = (el: {
    position: { x: number; y: number };
    width?: number;
    height?: number;
  }) => ({
    x1: el.position.x,
    y1: el.position.y,
    x2: el.position.x + (el.width ?? 0),
    y2: el.position.y + (el.height ?? 0),
  });

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;

    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      setSelectionStart(pos);
      setSelectionVisible(true);
      selectionRectRef.current?.setAttrs({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        visible: true,
      });
    }
  };

  const handleMouseMove = () => {
    if (!selectionStart || !selectionVisible) return;

    const pos = stageRef.current?.getPointerPosition();
    if (!pos) return;

    const newX = Math.min(selectionStart.x, pos.x);
    const newY = Math.min(selectionStart.y, pos.y);
    const newWidth = Math.abs(pos.x - selectionStart.x);
    const newHeight = Math.abs(pos.y - selectionStart.y);

    selectionRectRef.current?.setAttrs({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    });
  };

  const handleMouseUp = () => {
    if (!selectionStart || !selectionVisible) return;

    const box = selectionRectRef.current?.getClientRect();
    if (!box) return;

    const selected = venue?.floors.filter((el) =>
      isInside(getElementBounds(el), {
        x1: box.x,
        y1: box.y,
        x2: box.x + box.width,
        y2: box.y + box.height,
      }),
    );

    onSelectElements(selected);
    setSelectionStart(null);
    setSelectionVisible(false);
    selectionRectRef.current?.setAttrs({ visible: false });
  };

  const findElementById = (id: string, venue: Venue): VenueElement | null => {
    if (venue.id === id) return venue;

    for (const floor of venue.floors || []) {
      if (floor.id === id) return floor;

      for (const section of floor.sections || []) {
        if (section.id === id) return section;

        for (const row of section.rows || []) {
          if (row.id === id) return row;

          for (const seat of row.seats || []) {
            if (seat.id === id) return seat;
          }
        }
      }
    }

    return null;
  };

  const handleElementClick = (
    e: Konva.KonvaEventObject<MouseEvent>,
    elId: string,
  ) => {
    e.cancelBubble = true;
    const isSelected = selectedIds.includes(elId);

    if (e.evt.shiftKey) {
      const newSelection = isSelected
        ? selectedIds
            .filter((id) => id !== elId)
            .map((id) => findElementById(id, venue))
            .filter((el): el is Venue => Boolean(el))
        : [
            ...selectedIds
              .map((id) => findElementById(id, venue))
              .filter((el): el is Venue => Boolean(el)),
            ...(findElementById(elId, venue)
              ? [findElementById(elId, venue)!]
              : []),
          ];

      onSelectElements(newSelection as Venue[]);
    } else {
      const el = findElementById(elId, venue);
      if (el) onSelectElements([el as Venue]);
    }
  };

  const handleTransformEnd = (e: any, el: Venue) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const updated = {
      ...el,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      width: (el.width ?? 0) * scaleX,
      height: (el.height ?? 0) * scaleY,
    };

    node.scaleX(1);
    node.scaleY(1);

    setElements((prev) =>
      prev.map((item) => (item.id === el.id ? updated : item)),
    );
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;

    const pointerPos = e.target.getStage()?.getPointerPosition();
    console.log("Pointer Position:", pointerPos);
    if (!pointerPos) return;

    if (selectedTool?.type === "section") {
      if (selectedTool.rows > 0 && selectedTool.cols > 0) {
        {
          addSeatsGrid(pointerPos, selectedTool.rows, selectedTool.cols);
        }
      }
      setSelectedTool(null);
    } else if (selectedTool) {
      addElementAtPosition(selectedTool.type, pointerPos);
      setSelectedTool(null);
    } else {
      onSelectElements([]);
    }
  };

  const updateNestedElement = (
    id: string,
    updater: (el: Venue) => Venue,
    elementsArr: Venue[],
  ): Venue[] => {
    return elementsArr.map((el) => {
      if (el.id === id) return updater(el);

      if ("floors" in el && el.floors) {
        return {
          ...el,
          floors: el.floors.map((floor) => {
            if (floor.id === id) return updater(floor);

            if ("sections" in floor && floor.sections) {
              return {
                ...floor,
                sections: floor.sections.map((section) => {
                  if (section.id === id) return updater(section);

                  if ("rows" in section && section.rows) {
                    return {
                      ...section,
                      rows: section.rows.map((row) => {
                        if (row.id === id) return updater(row);
                        if ("seats" in row && row.seats) {
                          return {
                            ...row,
                            seats: row.seats.map((seat) =>
                              seat.id === id ? updater(seat) : seat,
                            ),
                          };
                        }
                        return row;
                      }),
                    };
                  }
                  return section;
                }),
              };
            }
            return floor;
          }),
        };
      }

      return el;
    });
  };

  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleStageClick}
      ref={stageRef}
      style={{ cursor: selectedTool?.type ? "crosshair" : "default" }}
    >
      <Layer>
        {venue.floors?.map((floor: FloorType) => (
          <Floor
            key={floor.id}
            el={floor}
            selectedIds={selectedIds}
            elementRefs={elementRefs}
            handleElementClick={handleElementClick}
            setElements={setElements}
            // handleTransformEnd={handleTransformEnd}
            groupEdgeBends={groupEdgeBends}
            setGroupEdgeBends={setGroupEdgeBends}
            onSelectElements={onSelectElements}
          />
        ))}

        <SelectionRect ref={selectionRectRef} visible={selectionVisible} />
        <CustomTransformer transformerRef={transformerRef} />
      </Layer>
    </Stage>
  );
};
