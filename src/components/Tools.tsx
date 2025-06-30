import { MdDoorSliding, MdEventSeat } from "react-icons/md";
import { ElementType, ToolType } from "../types/element";
import { IconButton } from "./ui/IconButton";
import {
  FaTheaterMasks,
  FaFont,
  FaTh,
  FaRedo,
  FaSave,
  FaUndo,
} from "react-icons/fa";
import { GiStoneWall } from "react-icons/gi";
import { useMapEditor } from "../context/MapEditorContext";

export type ToolsProps = {
  setIsMultipleSeatDialogOpen: (isOpen: boolean) => void;
  isSaving?: boolean;
};

export const Tools = ({
  setIsMultipleSeatDialogOpen,
  isSaving,
}: ToolsProps) => {
  const {
    selectedTool,
    setSelectedTool,
    history,
    setHistory,
    historyPointer,
    setHistoryPointer,
    setVenue,
  } = useMapEditor();

  const handleToolClick = (type: ElementType) => {
    const tool =
      type === "section" ? { type, rows: 0, cols: 0 } : ({ type } as ToolType);
    setSelectedTool(tool);
  };

  const handleUndo = () => {
    if (historyPointer > 0) {
      const newPointer = historyPointer - 1;
      setVenue(history[newPointer]);
      setHistoryPointer(newPointer);
    }
  };

  const handleRedo = () => {
    if (historyPointer < history.length - 1) {
      const newPointer = historyPointer + 1;
      setVenue(history[newPointer]);
      setHistoryPointer(newPointer);
    }
  };

  const handleOpenMultipleSeatDialog = (type: ElementType) => {
    if (type === "section") {
      const tool: ToolType = { type, rows: 0, cols: 0 };
      setSelectedTool(tool);
    }

    setIsMultipleSeatDialogOpen(true);
  };
  return (
    <div className="flex flex-row w-full h-full justify-between items-center bg-white shadow p-2 rounded-lg gap-2">
      <div className="flex flex-row w-full h-full  p-2 rounded-lg gap-2">
        <IconButton
          icon={<MdEventSeat size={28} />}
          tooltipText="Add Seat"
          onClick={() => handleToolClick("seat")}
          isSelected={selectedTool?.type === "seat"}
        />
        <IconButton
          icon={<FaTheaterMasks size={28} />}
          tooltipText="Add Stage"
          onClick={() => handleToolClick("stage")}
          aria-label="Add Stage"
          isSelected={selectedTool?.type === "stage"}
        />
        {/* Add Text Button */}
        <IconButton
          icon={<FaFont size={28} />}
          tooltipText="Add Text"
          onClick={() => handleToolClick("text")}
          aria-label="Add Text"
          isSelected={selectedTool?.type === "text"}
        />
        {/* Add Wall Button */}
        <IconButton
          icon={<GiStoneWall size={28} />}
          tooltipText="Add Wall"
          onClick={() => handleToolClick("wall")}
          aria-label="Add Wall"
          isSelected={selectedTool?.type === "wall"}
        />

        {/* Add Door Button */}
        <IconButton
          icon={<MdDoorSliding size={28} />}
          tooltipText="Add Door"
          onClick={() => handleToolClick("door")}
          aria-label="Add Door"
          isSelected={selectedTool?.type === "door"}
        />
        <IconButton
          icon={<FaTh size={28} />}
          tooltipText="Add Multiple Seats"
          onClick={() => handleOpenMultipleSeatDialog("section")}
          aria-label="Add multiple seats"
          isSelected={selectedTool?.type === "section"}
        />
      </div>
      <div className="flex space-x-4">
        {/* Undo Button */}
        <IconButton
          icon={<FaUndo />}
          tooltipText="Undo"
          onClick={handleUndo}
          disabled={historyPointer === 0}
          aria-label="Undo"
          className="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        />

        {/* Redo Button */}
        <IconButton
          icon={<FaRedo />}
          tooltipText="Redo"
          onClick={handleRedo}
          disabled={historyPointer === history.length - 1}
          aria-label="Redo"
          className="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        />

        {/* Save Button */}
        <IconButton
          icon={<FaSave />}
          tooltipText="Save"
          onClick={() => {}}
          disabled={isSaving}
          isLoading={isSaving}
          loadingText="Saving..."
          aria-label="Save map"
          className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        />
      </div>
    </div>
  );
};
