"use client";

import React, { FC, useRef, useEffect } from "react";
import { Venue } from "@/src/types/venue";
import { Layer, Rect, Stage } from "react-konva";
import { ToolType } from "@/src/types/element";
import { CanvasControls } from "../CanvasControls/CanvasControls";
import { useWindowSize } from "@/src/hooks/useWindowSize";
import { renderGrid } from "@/src/utils/helpers/renderGrid";
import { useCanvasEditor } from "./CanvasEditorContext";
import { useMapEditor } from "@/src/context/MapEditorContext";
import Konva from "konva";
import { useAddElement } from "@/src/hooks/useAddElement";
import { CanvasElementsRenderer } from "../CanvasElementRenderer";

export type CanvasEditorProps = {
  venue: Venue;
  setVenue: (venue: Venue) => void;
  selectedFloorId: string | null;
  onSelectFloor: (floorId: string) => void;
  onAddFloor: (id: string) => void;
  selectedTool: ToolType | null;
  setSelectedTool: (tool: ToolType | null) => void;
  rows: number;
  cols: number;
};

export const CanvasEditor: FC<CanvasEditorProps> = ({
  onSelectFloor,
  onAddFloor,
  selectedTool,
  setSelectedTool,
  rows,
  cols,
}) => {
  const stageRef = useRef<any>(null);
  const { rotation, setRotation, zoom, isDragging, setIsDragging } =
    useCanvasEditor();
  const { venue, setVenue, selectedFloorId, setSelectedElement } =
    useMapEditor();
  const addElement = useAddElement(venue, setVenue, selectedFloorId || "");
  const { width, height } = useWindowSize();

  useEffect(() => {
    const container = stageRef.current?.container();
    if (!container) return;

    if (isDragging) {
      container.style.cursor = "grabbing";
    } else if (selectedTool) {
      container.style.cursor = "crosshair";
    } else {
      container.style.cursor = "grab";
    }
  }, [isDragging, selectedTool]);

  const scaleFactor = zoom / 100;

  useEffect(() => {
    stageRef.current.rotation(rotation);
    stageRef.current.batchDraw();
  }, [rotation]);

  const onCanvasClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      if (selectedTool && selectedFloorId) {
        const stage = stageRef.current;
        const pointerPosition = stage.getPointerPosition();

        if (!pointerPosition) return;
        if (selectedTool.type === "section") {
          addElement(selectedTool, pointerPosition, {
            rowCount: rows,
            colCount: cols,
          });
        } else {
          addElement(selectedTool, pointerPosition);
        }

        setSelectedTool(null);
      }
    }
  };

  return (
    <>
      <Stage
        width={width}
        height={height}
        draggable
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        ref={stageRef}
        style={{ backgroundColor: "#fafafa" }}
        rotation={rotation}
        scaleX={scaleFactor}
        scaleY={scaleFactor}
        onClick={onCanvasClick}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            setSelectedElement(null);
          }
        }}
      >
        <Layer>{renderGrid(width, height)}</Layer>
        <Layer>
          <CanvasElementsRenderer />
        </Layer>
      </Stage>

      <CanvasControls
        venue={venue}
        selectedFloorId={selectedFloorId}
        onSelectFloor={onSelectFloor}
        onAddFloor={onAddFloor}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        setRotation={setRotation}
        rotation={rotation}
      />
    </>
  );
};
