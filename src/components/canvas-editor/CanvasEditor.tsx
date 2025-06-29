"use client";

import React, { FC, useRef, useEffect } from "react";
import { Venue } from "@/src/types/venue";
import { Layer, Rect, Stage } from "react-konva";
import { ToolType } from "@/src/types/element";
import { CanvasControls } from "../CanvasControls/CanvasControls";
import { useWindowSize } from "@/src/hooks/useWindowSize";
import { renderGrid } from "@/src/utils/renderGrid";
import { useCanvasEditor } from "./CanvasEditorContext";
import { useMapEditor } from "@/src/context/MapEditorContext";
import Konva from "konva";
import { useAddElement } from "@/src/hooks/useAddElement";

export type CanvasEditorProps = {
  venue: Venue;
  setVenue: (venue: Venue) => void;
  selectedFloorId: string | null;
  onSelectFloor: (floorId: string) => void;
  onAddFloor: (id: string) => void;
  selectedTool: ToolType | null;
  setSelectedTool: (tool: ToolType | null) => void;
};

export const CanvasEditor: FC<CanvasEditorProps> = ({
  onSelectFloor,
  onAddFloor,
  selectedTool,
  setSelectedTool,
}) => {
  const stageRef = useRef<any>(null);
  const { rotation, setRotation, zoom, isDragging, setIsDragging } =
    useCanvasEditor();
  const { venue, setVenue, selectedFloorId } = useMapEditor();
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
        console.log("Pointer position:", pointerPosition);
        if (!pointerPosition) return;

        addElement(selectedTool, pointerPosition);
        console.log("Added element:", pointerPosition);
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
      >
        <Layer>{renderGrid(width, height)}</Layer>

        <Layer>
          <Rect
            x={200}
            y={200}
            width={50}
            height={50}
            radius={50}
            fill="blue"
            stroke="black"
            strokeWidth={2}
            draggable
          />
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
