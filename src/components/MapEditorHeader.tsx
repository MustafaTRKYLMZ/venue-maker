import React from "react";
import { FaUndo, FaRedo, FaSave } from "react-icons/fa";
import { IconButton } from "./ui/IconButton";

export type MapEditorHeaderProps = {
  venueName: string;
  handleUndo?: () => void;
  historyPointer?: number;
  historyLength: number;
  handleRedo?: () => void;
  handleSaveMap?: () => void;
  isSaving?: boolean;
};

export const MapEditorHeader = ({
  venueName,
  handleUndo,
  historyPointer,
  historyLength,
  handleRedo,
  handleSaveMap,
  isSaving,
}: MapEditorHeaderProps) => {
  return (
    <header className="w-full bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">{venueName}</h1>
      <div className="flex space-x-4">
        {/* Undo Button */}
        <IconButton
          Icon={FaUndo}
          tooltipText="Undo"
          onClick={handleUndo}
          disabled={historyPointer === 0}
          aria-label="Undo"
          className="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        />

        {/* Redo Button */}
        <IconButton
          Icon={FaRedo}
          tooltipText="Redo"
          onClick={handleRedo}
          disabled={historyPointer === historyLength - 1}
          aria-label="Redo"
          className="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        />

        {/* Save Button */}
        <IconButton
          Icon={FaSave}
          tooltipText="Save"
          onClick={handleSaveMap}
          disabled={isSaving}
          isLoading={isSaving}
          loadingText="Saving..."
          aria-label="Save map"
          className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        />
      </div>
    </header>
  );
};
