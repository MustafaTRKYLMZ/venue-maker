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
import { FaRegHand } from "react-icons/fa6";

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
    historyPointer,
    setHistoryPointer,
    setVenue,
    onSave,
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
          icon={<FaRegHand size={28} />}
          tooltipText="Move Tool"
          onClick={() => handleToolClick("hand")}
          isSelected={selectedTool?.type === "hand"}
        />
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
          icon={<FaTh />}
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
        />

        {/* Redo Button */}
        <IconButton
          icon={<FaRedo />}
          tooltipText="Redo"
          onClick={handleRedo}
          disabled={historyPointer === history.length - 1}
          aria-label="Redo"
        />

        {/* Save Button */}
        <IconButton
          icon={<FaSave />}
          tooltipText="Save"
          onClick={onSave}
          disabled={isSaving}
          isLoading={isSaving}
          loadingText="Saving..."
          aria-label="Save map"
        />
      </div>
    </div>
  );
};
