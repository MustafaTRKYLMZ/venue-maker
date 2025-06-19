import { MdEventSeat } from "react-icons/md";
import { ElementType } from "../types/element";
import { IconButton } from "./IconButton";
import { FaTheaterMasks, FaFont } from "react-icons/fa";
import { GiStoneWall } from "react-icons/gi";

export type ToolsProps = {
  handleAddButtonClick: (type: ElementType) => void;
};

export const Tools = ({ handleAddButtonClick }: ToolsProps) => {
  return (
    <div className="space-y-2">
      <IconButton
        Icon={MdEventSeat}
        tooltipText="Undo"
        onClick={() => handleAddButtonClick("seat")}
        aria-label=" Add Seat"
        className="text-left px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 justify-start"
      />
      <IconButton
        Icon={FaTheaterMasks}
        tooltipText="Add Stage"
        onClick={() => handleAddButtonClick("stage")}
        aria-label="Add stage"
        className="text-left px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 justify-start"
      />
      {/* Add Text Button */}
      <IconButton
        Icon={FaFont}
        tooltipText="Add Text"
        onClick={() => handleAddButtonClick("text")}
        aria-label="Add text"
        className="text-left px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 justify-start"
      />
      {/* Add Wall Button */}
      <IconButton
        Icon={GiStoneWall}
        tooltipText="Add Wall"
        onClick={() => handleAddButtonClick("wall")}
        aria-label="Add wall"
        className="text-left px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 justify-start"
      />
    </div>
  );
};
