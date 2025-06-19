import { IconButton } from "./IconButton";
import { useState } from "react";
import { AddMultipleSeatDialog } from "./AddMultipleSeatDialog";
import { FaTh } from "react-icons/fa";

export type AddMultipleSeatProps = {
  rows: number;
  setRows: (value: number) => void;
  setCols: (value: number) => void;
  addSeatsGrid: (
    startX: number,
    startY: number,
    rows: number,
    cols: number,
    seatWidth: number,
    seatHeight: number,
    gap?: number
  ) => void;
  cols: number;
};
export const AddMultipleSeat = ({
  rows,
  setRows,
  setCols,
  addSeatsGrid,
  cols,
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
          className="text-left px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 justify-start"
        />
        {isMultipleSeatDialogOpen && (
          <AddMultipleSeatDialog
            rows={rows}
            setRows={setRows}
            cols={cols}
            setCols={setCols}
            addSeatsGrid={addSeatsGrid}
            onClose={handleCloseMultipleSeatDialog}
            positionClasses="left-full top-0 ml-4"
          />
        )}
      </div>
    </div>
  );
};
