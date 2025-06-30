import { IconButton } from "./ui/IconButton";
import { FaTh } from "react-icons/fa";
import { ElementType, ToolType } from "../types/element";
import { useMapEditor } from "../context/MapEditorContext";

export type AddMultipleSeatProps = {
  setIsMultipleSeatDialogOpen: (isOpen: boolean) => void;
};
export const AddMultipleSeat = ({
  setIsMultipleSeatDialogOpen,
}: AddMultipleSeatProps) => {
  const { selectedTool, setSelectedTool } = useMapEditor();

  const handleOpenMultipleSeatDialog = (type: ElementType) => {
    if (type === "section") {
      const tool: ToolType = { type, rows: 0, cols: 0 };
      setSelectedTool(tool);
    }
    console.log("Opening multiple seat dialog with type:", type);
    setIsMultipleSeatDialogOpen(true);
  };
  console.log("AddMultipleSeat rendered >>>", selectedTool?.type);
  return (
    <div className="mb-4 mt-2 flex flex-col gap-2">
      <div className="relative">
        <IconButton
          icon={<FaTh />}
          tooltipText="Add Multiple Seats"
          onClick={() => handleOpenMultipleSeatDialog("section")}
          aria-label="Add multiple seats"
          isSelected={selectedTool?.type === "section"}
        />
      </div>
    </div>
  );
};
