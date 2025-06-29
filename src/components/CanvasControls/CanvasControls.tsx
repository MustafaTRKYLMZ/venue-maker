"use client";

import { FC } from "react";
import { RotateTool } from "./RotateTool";
import { FloorSelector } from "../FloorSelector";
import { ZoomTool } from "./ZoomTool";
import { Venue } from "@/src/types/venue";
import { ToolType } from "@/src/types/element";

type CanvasControlsProps = {
  venue: Venue;
  selectedFloorId: string | null;
  onSelectFloor: (floorId: string) => void;
  onAddFloor: (id: string) => void;
  selectedTool: ToolType | null;
  setSelectedTool: (tool: ToolType | null) => void;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  rotation: number;
};

export const CanvasControls: FC<CanvasControlsProps> = ({
  venue,
  selectedFloorId,
  onSelectFloor,
  onAddFloor,
  setSelectedTool,
}) => {
  return (
    <div className="relative left-4 bottom-4 z-1 space-y-4">
      <FloorSelector
        floors={venue.floors}
        selectedFloorId={selectedFloorId}
        onSelectFloor={onSelectFloor}
        onAddFloor={onAddFloor}
        setSelectedTool={setSelectedTool}
      />
      <RotateTool />
      <ZoomTool />
    </div>
  );
};
