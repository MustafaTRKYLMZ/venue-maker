"use client";

import React, { FC, useRef, useEffect } from "react";
import { Venue } from "@/src/types/venue";
import { Layer, Rect, Stage } from "react-konva";
import { ToolType } from "@/src/types/element";
import { CanvasControls } from "../CanvasControls/CanvasControls";
import { useWindowSize } from "@/src/hooks/useWindowSize";
import { renderGrid } from "@/src/utils/renderGrid";
import { useCanvasEditor } from "./CanvasEditorContext";

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
  venue,
  setVenue,
  selectedFloorId,
  onSelectFloor,
  onAddFloor,
  selectedTool,
  setSelectedTool,
}) => {
  const stageRef = useRef<any>(null);
  const { rotation, setRotation, zoom, isDragging, setIsDragging } =
    useCanvasEditor();

  const { width, height } = useWindowSize();

  useEffect(() => {
    if (stageRef.current) {
      const container = stageRef.current.container();
      container.style.cursor = isDragging ? "grabbing" : "grab";
    }
  }, [isDragging]);

  const scaleFactor = zoom / 100;

  useEffect(() => {
    stageRef.current.rotation(rotation);
    stageRef.current.batchDraw();
  }, [rotation]);

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
