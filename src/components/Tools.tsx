import { ElementType } from "../types/element";

export type ToolsProps = {
  handleAddButtonClick: (type: ElementType) => void;
};

export const Tools = ({ handleAddButtonClick }: ToolsProps) => {
  return (
    <div className="space-y-2">
      <button
        className="w-full text-left px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
        onClick={() => handleAddButtonClick("seat")}
      >
        Add Seat
      </button>
      <button
        className="w-full text-left px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
        onClick={() => handleAddButtonClick("stage")}
      >
        Add Stage
      </button>
      <button
        className="w-full text-left px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
        onClick={() => handleAddButtonClick("text")}
      >
        Add Text
      </button>
      <button
        className="w-full text-left px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
        onClick={() => handleAddButtonClick("wall")}
      >
        Add Wall
      </button>
    </div>
  );
};
