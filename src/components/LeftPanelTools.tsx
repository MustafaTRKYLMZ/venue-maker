import React, { FC } from "react";
import { ElementType } from "../types/element";
import { Tools } from "./Tools";
import { AddMultipleSeat } from "./AddMultipleSeat";

export type LeftPanelToolsTypes = {
  handleAddButtonClick: (type: ElementType) => void;
  rows: number;
  setRows: (value: number) => void;
  cols: number;
  setCols: (value: number) => void;
  onConfirmAddSeats: (type: ElementType, rows: number, cols: number) => void;
};

export const LeftPanelTools: FC<LeftPanelToolsTypes> = ({
  handleAddButtonClick,
  rows,
  setRows,
  cols,
  setCols,
  onConfirmAddSeats,
}) => {
  return (
    <aside className="w-20 bg-white shahow p-4 border-r border-t border-gray-200 flex-shrink-0">
      <h2 className="text-xl text-gray-800 font-semibold mb-4">Tools</h2>
      <Tools handleAddButtonClick={handleAddButtonClick} />
      <AddMultipleSeat
        rows={rows}
        setRows={setRows}
        cols={cols}
        setCols={setCols}
        // addSeatsGrid={addSeatsGrid}
        onConfirmAddSeats={onConfirmAddSeats}
      />
    </aside>
  );
};
