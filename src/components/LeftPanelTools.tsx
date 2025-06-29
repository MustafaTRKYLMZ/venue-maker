"use client";

import React, { FC } from "react";
import { ElementType, ToolType } from "@/src/types/element";
import { Tools } from "./Tools";

type LeftPanelToolsProps = {
  setIsMultipleSeatDialogOpen: (isOpen: boolean) => void;
};

export const LeftPanelTools: FC<LeftPanelToolsProps> = ({
  setIsMultipleSeatDialogOpen,
}) => {
  return (
    <aside className="flex flex-col h-full bg-white shadow p-2 border-r border-gray-200 flex-shrink-0">
      <h2 className="text-lg text-gray-800 font-semibold mb-2">Tools</h2>
      <Tools setIsMultipleSeatDialogOpen={setIsMultipleSeatDialogOpen} />
    </aside>
  );
};
