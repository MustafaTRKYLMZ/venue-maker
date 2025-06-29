import { useEffect, useRef, useState } from "react";
import { ElementType } from "../types/element";
import { useMapEditor } from "../context/MapEditorContext";

type AddMultipleSeatDialogProps = {
  rows: number;
  setRows: (value: number) => void;
  setCols: (value: number) => void;
  onConfirmAddSeats: (type: ElementType, rows: number, cols: number) => void;
  cols: number;
  onClose: () => void;
};

export const AddMultipleSeatDialog = ({
  rows,
  setRows,
  setCols,
  onConfirmAddSeats,
  cols,
  onClose,
}: AddMultipleSeatDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleAddGrid = () => {
    onConfirmAddSeats("section", rows, cols);
    onClose();
  };

  return (
    <div
      ref={dialogRef}
      className="absolute z-[99999] bg-white p-4 rounded-lg shadow-xl w-64 border border-gray-200"
    >
      <div className="flex justify-end">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        Add Multiple Seats
      </h3>
      <div className="mb-4 flex flex-col gap-2">
        <label className="text-sm text-gray-700">
          Row:
          <input
            type="number"
            min={1}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="text-sm text-gray-700">
          Column:
          <input
            type="number"
            min={1}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <button
          onClick={handleAddGrid}
          className="w-full mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Add Multiple Seats
        </button>
      </div>
    </div>
  );
};
