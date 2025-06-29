"use client";

import React, { FC } from "react";
import { ElementType, ToolType } from "@/src/types/element";
import { Tools } from "./Tools";

type LeftPanelToolsProps = {
  selectedTool: ToolType | null;
  setSelectedTool: (tool: ToolType | null) => void;
  setIsMultipleSeatDialogOpen: (isOpen: boolean) => void;
};

export const LeftPanelTools: FC<LeftPanelToolsProps> = ({
  setIsMultipleSeatDialogOpen,
  selectedTool,
  setSelectedTool,
}) => {
  return (
    <aside className=" h-full bg-white shadow p-4 border-r border-gray-200 flex-shrink-0">
      <h2 className="text-lg text-gray-800 font-semibold mb-4">Tools</h2>
      <Tools
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        setIsMultipleSeatDialogOpen={setIsMultipleSeatDialogOpen}
      />
    </aside>
  );
};
