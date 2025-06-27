import { IconButton } from "./IconButton";
import { useState } from "react";
import { AddMultipleSeatDialog } from "./AddMultipleSeatDialog";
import { FaTh } from "react-icons/fa";
import { ElementType, ToolType } from "../types/element";
import { getToolButtonClass } from "../utils/helpers/getToolButtonClass";

export type AddMultipleSeatProps = {
  rows: number;
  setRows: (value: number) => void;
  setCols: (value: number) => void;
  onConfirmAddSeats: (type: ElementType, rows: number, cols: number) => void;
  cols: number;
  selectedTool?: ToolType | null;
};
export const AddMultipleSeat = ({
  rows,
  setRows,
  setCols,
  onConfirmAddSeats,
  cols,
  selectedTool,
}: AddMultipleSeatProps) => {
  const [isMultipleSeatDialogOpen, setIsMultipleSeatDialogOpen] =
    useState(false);

  const handleOpenMultipleSeatDialog = () => {
    setIsMultipleSeatDialogOpen(true);
  };

  const handleCloseMultipleSeatDialog = () => {
    setIsMultipleSeatDialogOpen(false);
  };

  return (
    <div className="mb-4 mt-2 flex flex-col gap-2">
      <div className="relative">
        <IconButton
          Icon={FaTh}
          tooltipText="Add Multiple Seats (Grid)"
          onClick={handleOpenMultipleSeatDialog}
          aria-label="Add multiple seats"
          className={getToolButtonClass(
            selectedTool?.type as string,
            "section",
          )}
        />
        {isMultipleSeatDialogOpen && (
          <AddMultipleSeatDialog
            rows={rows}
            setRows={setRows}
            cols={cols}
            setCols={setCols}
            onConfirmAddSeats={onConfirmAddSeats}
            onClose={handleCloseMultipleSeatDialog}
            positionClasses="left-full top-0 ml-4"
          />
        )}
      </div>
    </div>
  );
};
