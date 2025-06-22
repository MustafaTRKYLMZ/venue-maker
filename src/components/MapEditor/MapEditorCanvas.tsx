"use client";

import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Group } from "react-konva";
import Konva from "konva";
import { MapElement } from "@/src/types/mapElement";
import { ElementType } from "@/src/types/element";
import { KonvaEventObject } from "konva/lib/Node";
import { Seat } from "./Seat";
import { GroupElement } from "./GroupElement";
import { getElementBounds } from "@/src/utils/helpers";
import { GroupEdgeBends } from "@/src/types/groupEdgeBends";
import { BasicElement } from "./BasicElement";
import { SelectionRect } from "./SelectionRect";
import { CustomTransformer } from "./CustomTransformer";

type MapEditorCanvasProps = {
  width: number;
  height: number;
  elements: MapElement[];
  setElements: React.Dispatch<React.SetStateAction<MapElement[]>>;
  selectedIds: string[];
  onSelectElements: (elements: MapElement[]) => void;
  selectedTool: ElementType | null;
  addElementAtPosition: (
    type: ElementType,
    position: { x: number; y: number }
  ) => void;
  setSelectedTool: (tool: string | null) => void;
  addSeatsGrid: (
    position: { x: number; y: number },
    rows: number,
    cols: number,
    seatWidth: number,
    seatHeight: number,
    gap?: number
  ) => void;

  multipleSeatsGridFields?: {
    rows: number;
    cols: number;
  };
};

export const MapEditorCanvas: React.FC<MapEditorCanvasProps> = ({
  width,
  height,
  elements,
  setElements,
  selectedIds,
  onSelectElements,
  selectedTool,
  addElementAtPosition,
  setSelectedTool,
  addSeatsGrid,
  multipleSeatsGridFields = { rows: 0, cols: 0 },
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

  // Yeni: Grup yay deformasyonları (top, right, bottom, left)
  const [groupEdgeBends, setGroupEdgeBends] = useState<GroupEdgeBends>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const transformer = transformerRef.current;

    if (!transformer) return;
    requestAnimationFrame(() => {
      const selectedNodes = selectedIds
        .map((id) => elementRefs.current[id])
        .filter(Boolean) as Konva.Node[];

      transformer.nodes(selectedNodes);
      transformer.getLayer()?.batchDraw();
    });
  }, [selectedIds]);

  const isInside = (a: any, b: any) =>
    a.x1 >= b.x1 && a.y1 >= b.y1 && a.x2 <= b.x2 && a.y2 <= b.y2;

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

    const selected = elements.filter((el) =>
      isInside(getElementBounds(el), {
        x1: box.x,
        y1: box.y,
        x2: box.x + box.width,
        y2: box.y + box.height,
      })
    );

    onSelectElements(selected);
    setSelectionStart(null);
    setSelectionVisible(false);
    selectionRectRef.current?.setAttrs({ visible: false });
  };

  const handleElementClick = (e: any, el: MapElement) => {
    e.cancelBubble = true;
    const isSelected = selectedIds.includes(el.id);

    if (e.evt.shiftKey) {
      const newSelection = isSelected
        ? selectedIds
            .filter((id) => id !== el.id)
            .map((id) => elements.find((e) => e.id === id)!)
        : [...selectedIds.map((id) => elements.find((e) => e.id === id)!), el];

      onSelectElements(newSelection.filter(Boolean));
    } else {
      onSelectElements([el]);
    }
  };

  const handleTransformEnd = (
    e: Konva.KonvaEventObject<Event>,
    el: MapElement
  ) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const updated = {
      ...el,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      width: el.width * scaleX,
      height: el.height * scaleY,
    };

    node.scaleX(1);
    node.scaleY(1);

    setElements((prev) =>
      prev.map((item) => (item.id === el.id ? updated : item))
    );
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) {
      return;
    }
    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    const container = stage.container();

    if (selectedTool === "multiple_seat") {
      if (
        multipleSeatsGridFields.rows > 0 &&
        multipleSeatsGridFields.cols > 0
      ) {
        addSeatsGrid(
          pointerPos,
          multipleSeatsGridFields.rows,
          multipleSeatsGridFields.cols,
          40,
          40
        );
      }
      setSelectedTool(null);
    } else if (selectedTool) {
      addElementAtPosition(selectedTool, pointerPos);
      setSelectedTool(null);
      if (container) container.style.cursor = "default";
    } else {
      onSelectElements([]);
    }
  };

  // Yeni: grup için özel render fonksiyonu
  const renderGroupElement = (el: MapElement) => {
    const isSelected = selectedIds.includes(el.id);

    // Burada yay deformasyonuna göre grup şekli çiziliyor
    return (
      <GroupElement
        key={el.id}
        handleElementClick={handleElementClick}
        setElements={setElements}
        handleTransformEnd={handleTransformEnd}
        setGroupEdgeBends={setGroupEdgeBends}
        selectedIds={selectedIds}
        groupEdgeBends={groupEdgeBends}
        el={el}
        isSelected={isSelected}
      />
    );
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
      style={{ cursor: selectedTool ? "crosshair" : "default" }}
    >
      <Layer>
        {elements.map((el) =>
          el.type === "group" ? (
            renderGroupElement(el)
          ) : (
            <Group
              key={el.id}
              x={el.x}
              y={el.y}
              draggable
              onDragEnd={(e) => {
                const node = e.target;
                const newX = node.x();
                const newY = node.y();

                setElements((prev) =>
                  prev.map((item) =>
                    item.id === el.id ? { ...item, x: newX, y: newY } : item
                  )
                );
              }}
            >
              {el.type === "seat" ? (
                <Seat el={el} selectedIds={selectedIds} />
              ) : (
                <BasicElement el={el} selectedIds={selectedIds} />
              )}
            </Group>
          )
        )}

        {/* selection box */}
        <SelectionRect ref={selectionRectRef} visible={false} />
        <CustomTransformer transformerRef={transformerRef} />
      </Layer>
    </Stage>
  );
};
