import { IconButton } from "./ui/IconButton";
import { FaTh } from "react-icons/fa";
import { ToolType } from "../types/element";

export type AddMultipleSeatProps = {
  selectedTool?: ToolType | null;
  setSelectedTool: (tool: ToolType | null) => void;
  setIsMultipleSeatDialogOpen: (isOpen: boolean) => void;
};
export const AddMultipleSeat = ({
  selectedTool,
  setSelectedTool,
  setIsMultipleSeatDialogOpen,
}: AddMultipleSeatProps) => {
  const handleOpenMultipleSeatDialog = (type: string) => {
    if (type === "section") {
      const tool: ToolType = { type, rows: 0, cols: 0 };
      setSelectedTool(tool);
    }
    setIsMultipleSeatDialogOpen(true);
  };

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
