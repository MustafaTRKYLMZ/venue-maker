import { MdEventSeat } from "react-icons/md";
import { ElementType, ToolType } from "../types/element";
import { IconButton } from "./IconButton";
import { FaTheaterMasks, FaFont } from "react-icons/fa";
import { GiStoneWall } from "react-icons/gi";
import { getToolButtonClass } from "../utils/helpers/getToolButtonClass";

export type ToolsProps = {
  handleAddButtonClick: (type: ElementType) => void;
  selectedTool?: ToolType | null;
};

export const Tools = ({ handleAddButtonClick, selectedTool }: ToolsProps) => {
  const selectedType = selectedTool?.type ?? null;

  return (
    <div className="space-y-2">
      <IconButton
        Icon={MdEventSeat}
        tooltipText="Add Seat"
        onClick={() => handleAddButtonClick("seat")}
        aria-label="Add Seat"
        className={getToolButtonClass(selectedType, "seat")}
      />
      <IconButton
        Icon={FaTheaterMasks}
        tooltipText="Add Stage"
        onClick={() => handleAddButtonClick("stage")}
        aria-label="Add Stage"
        className={getToolButtonClass(selectedType, "stage")}
      />
      {/* Add Text Button */}
      <IconButton
        Icon={FaFont}
        tooltipText="Add Text"
        onClick={() => handleAddButtonClick("text")}
        aria-label="Add Text"
        className={getToolButtonClass(selectedType, "text")}
      />
      {/* Add Wall Button */}
      <IconButton
        Icon={GiStoneWall}
        tooltipText="Add Wall"
        onClick={() => handleAddButtonClick("wall")}
        aria-label="Add Wall"
        className={getToolButtonClass(selectedType, "wall")}
      />
    </div>
  );
};
