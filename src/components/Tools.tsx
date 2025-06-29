import { MdEventSeat } from "react-icons/md";
import { ElementType, ToolType } from "../types/element";
import { IconButton } from "./ui/IconButton";
import { FaTheaterMasks, FaFont } from "react-icons/fa";
import { GiStoneWall } from "react-icons/gi";
import { AddMultipleSeat } from "./AddMultipleSeat";
import { useState } from "react";

export type ToolsProps = {
  selectedTool: ToolType | null;
  setSelectedTool: (tool: ToolType | null) => void;
  setIsMultipleSeatDialogOpen: (isOpen: boolean) => void;
};

export const Tools = ({
  selectedTool,
  setSelectedTool,
  setIsMultipleSeatDialogOpen,
}: ToolsProps) => {
  const handleToolClick = (type: ElementType) => {
    const tool =
      type === "section" ? { type, rows: 0, cols: 0 } : ({ type } as ToolType);
    setSelectedTool(tool);
  };

  return (
    <div className="space-y-2">
      <IconButton
        icon={<MdEventSeat />}
        tooltipText="Add Seat"
        onClick={() => handleToolClick("seat")}
        isSelected={selectedTool?.type === "seat"}
      />
      <IconButton
        icon={<FaTheaterMasks />}
        tooltipText="Add Stage"
        onClick={() => handleToolClick("stage")}
        aria-label="Add Stage"
        isSelected={selectedTool?.type === "stage"}
      />
      {/* Add Text Button */}
      <IconButton
        icon={<FaFont />}
        tooltipText="Add Text"
        onClick={() => handleToolClick("text")}
        aria-label="Add Text"
        isSelected={selectedTool?.type === "text"}
      />
      {/* Add Wall Button */}
      <IconButton
        icon={<GiStoneWall />}
        tooltipText="Add Wall"
        onClick={() => handleToolClick("wall")}
        aria-label="Add Wall"
        isSelected={selectedTool?.type === "wall"}
      />
      <AddMultipleSeat
        setSelectedTool={setSelectedTool}
        setIsMultipleSeatDialogOpen={setIsMultipleSeatDialogOpen}
        // rows={rows}
        // setRows={setRows}
        // cols={cols}
        // setCols={setCols}
        selectedTool={selectedTool}
        // onConfirmAddSeats={handleConfirmAddSeats}
      />
    </div>
  );
};
