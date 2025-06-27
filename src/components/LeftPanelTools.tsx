"use client";

import React, { FC } from "react";
import { Venue } from "@/src/types/venue";
import { ElementType, ToolType } from "@/src/types/element";
import { Tools } from "./Tools";
import { AddMultipleSeat } from "./AddMultipleSeat";

type LeftPanelToolsProps = {
  selectedTool: ToolType | null;
  setSelectedTool: (tool: ToolType | null) => void;
};

export const LeftPanelTools: FC<LeftPanelToolsProps> = ({
  selectedTool,
  setSelectedTool,
}) => {
  const [rows, setRows] = React.useState<number>(5);
  const [cols, setCols] = React.useState<number>(10);

  const handleToolClick = (type: ElementType) => {
    const tool =
      type === "section" ? { type, rows: 0, cols: 0 } : ({ type } as ToolType);
    setSelectedTool(tool);
  };

  const handleConfirmAddSeats = () => {
    setSelectedTool({ type: "section", rows, cols });
  };

  return (
    <aside className=" h-full bg-white shadow p-4 border-r border-gray-200 flex-shrink-0">
      <h2 className="text-lg text-gray-800 font-semibold mb-4">Tools</h2>
      <Tools
        handleAddButtonClick={handleToolClick}
        selectedTool={selectedTool}
      />
      <div className="mt-6">
        <AddMultipleSeat
          rows={rows}
          setRows={setRows}
          cols={cols}
          setCols={setCols}
          selectedTool={selectedTool}
          onConfirmAddSeats={handleConfirmAddSeats}
        />
      </div>
    </aside>
  );
};
