import React from "react";
import {
  FaUndo,
  FaRedo,
  FaObjectGroup,
  FaObjectUngroup,
  FaSave,
  FaShareAlt,
} from "react-icons/fa";
import { MapElement } from "@/src/types/mapElement";
import { IconButton } from "./IconButton";

export type MapEditorHeaderProps = {
  mapName: string;
  handleUndo: () => void;
  historyPointer: number;
  historyLength: number;
  handleRedo: () => void;
  handleGroupElements: () => void;
  selectedElements: MapElement[];
  handleUngroupElements: () => void;
  handleSaveMap: () => void;
  isSaving: boolean;
};

export const MapEditorHeader = ({
  mapName,
  handleUndo,
  historyPointer,
  historyLength,
  handleRedo,
  handleGroupElements,
  selectedElements,
  handleUngroupElements,
  handleSaveMap,
  isSaving,
}: MapEditorHeaderProps) => {
  return (
    <header className="w-full bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">{mapName}</h1>
      <div className="flex space-x-4">
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

        {/* Group Button */}
        <IconButton
          Icon={FaObjectGroup}
          tooltipText="Group"
          onClick={handleGroupElements}
          disabled={
            selectedElements.length < 2 ||
            selectedElements.some((el) => el.type === "group")
          }
          aria-label="Group elements"
          className="bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
        />

        {/* Ungroup Button */}
        <IconButton
          Icon={FaObjectUngroup}
          tooltipText="Ungroup"
          onClick={handleUngroupElements}
          disabled={
            selectedElements.length !== 1 ||
            selectedElements[0]?.type !== "group"
          }
          aria-label="Ungroup elements"
          className="bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50"
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

        {/* Publish Button */}
        <IconButton
          Icon={FaShareAlt}
          tooltipText="Publish"
          aria-label="Publish map"
          className="bg-purple-600 text-white hover:bg-purple-700"
          // Add onClick handler for publish functionality if needed
        />
      </div>
    </header>
  );
};
