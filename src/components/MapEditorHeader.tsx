import React from "react";
import { IconButton } from "./ui/IconButton";
import { BsMenuButtonWide } from "react-icons/bs";
import { Tools } from "./Tools";
import { VenueSummary } from "./VenueSummary";
import { FileMenu } from "./FileMenu";

export type MapEditorHeaderProps = {
  venueName?: string;
  setIsMultipleSeatDialogOpen?: (isOpen: boolean) => void;
};

export const MapEditorHeader = ({
  venueName,
  setIsMultipleSeatDialogOpen,
}: MapEditorHeaderProps) => {
  return (
    <header className="flex flex-col flex-start sticky top-0 z-50 w-full bg-white shadow flex justify-between items-start">
      <div className="flex flex-row justify-between items-center w-full p-2 border-b border-gray-200">
        <div className="flex flex-col  gap-4">
          <h1 className="text-2xl font-bold text-gray-800">{venueName}</h1>
          <FileMenu />
        </div>
        {/*Venue summary */}
        <VenueSummary />
      </div>

      <Tools
        setIsMultipleSeatDialogOpen={setIsMultipleSeatDialogOpen || (() => {})}
      />
    </header>
  );
};
