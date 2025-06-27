"use client";

import React from "react";
import { FaPlus } from "react-icons/fa";
import { Floor } from "@/src/types/venue";
import { IconButton } from "./IconButton";
import { ElementType, ToolType } from "../types/element";
import { getToolButtonClass } from "../utils/helpers/getToolButtonClass";

interface FloorSelectorProps {
  floors: Floor[];
  selectedFloorId: string | null;
  onSelectFloor: (floorId: string) => void;
  onAddFloor: (id: string) => void;
  selectedTool: ToolType | null;
  setSelectedTool: (tool: ToolType | null) => void;
}

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  floors,
  selectedFloorId,
  selectedTool,
  setSelectedTool,
  onSelectFloor,
}) => {
  const selectedType = selectedTool?.type ?? null;

  const handleClick = (type: ElementType) => {
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
        console.error(`Unsupported type: ${type}`);
        return;
      }
    }

    setSelectedTool(tool);
  };
  return (
    <div className="absolute left-4 bottom-4 flex flex-col items-center gap-2 bg-white bg-opacity-80 p-2 rounded shadow-md">
      <IconButton
        Icon={FaPlus}
        tooltipText="Add Floor"
        onClick={() => handleClick("floor")}
        aria-label="Add Stage"
        className={getToolButtonClass(selectedType, "floor")}
      />
      <div className="flex flex-col-reverse gap-1 max-h-48 overflow-auto">
        {floors.map((floor) => (
          <button
            key={floor.id}
            onClick={() => onSelectFloor(floor.id)}
            className={`w-10 h-10 rounded-full border text-center flex items-center justify-center font-semibold transition ${
              selectedFloorId === floor.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
            aria-label={`Select Floor ${floor.index + 1}`}
          >
            {floor.index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
