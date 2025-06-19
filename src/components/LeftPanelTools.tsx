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
  addSeatsGrid: (
    startX: number,
    startY: number,
    rows: number,
    cols: number,
    seatWidth: number,
    seatHeight: number,
    gap?: number,
  ) => void;
};

export const LeftPanelTools: FC<LeftPanelToolsTypes> = ({
  handleAddButtonClick,
  rows,
  setRows,
  cols,
  setCols,
  addSeatsGrid,
}) => {
  return (
    <aside className="w-64 bg-gray-100 p-4 border-r border-gray-200 flex-shrink-0">
      <h2 className="text-xl font-semibold mb-4">Tools</h2>
      <Tools handleAddButtonClick={handleAddButtonClick} />
      <AddMultipleSeat
        rows={rows}
        setRows={setRows}
        cols={cols}
        setCols={setCols}
        addSeatsGrid={addSeatsGrid}
      />
    </aside>
  );
};
