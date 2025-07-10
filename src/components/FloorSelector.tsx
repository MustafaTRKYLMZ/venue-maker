"use client";

import React from "react";
import { FaPlus } from "react-icons/fa";
import { Floor } from "@/src/types/venue";
import { IconButton } from "./ui/IconButton";
import { ElementType, ToolType } from "../types/element";
import { Button } from "@/components/ui/button";
import { cn } from "../utils/cn";
import { toast } from "sonner";

interface FloorSelectorProps {
  floors: Floor[];
  selectedFloorId: string | null;
  onSelectFloor: (floorId: string) => void;
  onAddFloor: (id: string) => void;
  setSelectedTool: (tool: ToolType | null) => void;
}

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  floors,
  selectedFloorId,
  setSelectedTool,
  onSelectFloor,
}) => {
  const handleFloor = (type: ElementType) => {
    let tool: ToolType;

    if (type === "section") {
      tool = { type: "section", rows: 0, cols: 0 };
    } else {
      if (
        type === "floor" ||
        type === "row" ||
        type === "seat" ||
        type === "stage" ||
        type === "light" ||
        type === "door" ||
        type === "wall" ||
        type === "controlRoom"
      ) {
        tool = { type };
      } else {
        toast.error(`Unsupported type: ${type}`);
        console.error(`Unsupported type: ${type}`);
        return;
      }
    }

    setSelectedTool(tool);
  };
  return (
    <div className="fixed left-1/8 bottom-4 flex flex-col items-center gap-2 bg-transparent bg-opacity-80 p-2 rounded shadow-md">
      <IconButton
        icon={<FaPlus />}
        tooltipText="Add Floor"
        onClick={() => handleFloor("floor")}
        aria-label="Add Floor"
        className="w-10 h-10 border border-primary bg-muted hover:bg-muted/70"
      />

      <div className="flex flex-col-reverse gap-1 max-h-48 overflow-auto">
        {floors.map((floor) => (
          <Button
            key={floor.id}
            onClick={() => onSelectFloor(floor.id)}
            aria-label={`Select Floor ${floor.index + 1}`}
            className={cn(
              "w-full text-left border rounded-md transition-colors",
              selectedFloorId === floor.id
                ? "bg-orange-500 text-white hover:bg-orange-600 border-orange-600"
                : "bg-white text-gray-800 hover:bg-gray-100 border-gray-300",
            )}
          >
            {floor.index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};
