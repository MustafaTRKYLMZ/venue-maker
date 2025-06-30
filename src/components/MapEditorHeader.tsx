import React from "react";
import { FaUndo, FaRedo, FaSave } from "react-icons/fa";
import { IconButton } from "./ui/IconButton";
import { Tools } from "./Tools";

export type MapEditorHeaderProps = {
  venueName: string;
  handleUndo?: () => void;
  historyPointer?: number;
  historyLength: number;
  handleRedo?: () => void;
  handleSaveMap?: () => void;
  isSaving?: boolean;
  setIsMultipleSeatDialogOpen: (isOpen: boolean) => void;
};

export const MapEditorHeader = ({
  venueName,
  handleUndo,
  historyPointer,
  historyLength,
  handleRedo,
  handleSaveMap,
  isSaving,
  setIsMultipleSeatDialogOpen,
}: MapEditorHeaderProps) => {
  return (
    <header className="flex flex-col flex-start w-full bg-white shadow flex justify-between items-start">
      <div className="flex flex-row justify-between items-center w-full p-2 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">{venueName}</h1>
      </div>

      <Tools setIsMultipleSeatDialogOpen={setIsMultipleSeatDialogOpen} />
    </header>
  );
};
