import React from "react";
import { ElementType } from "../types/element";

export type AddMultipleSeatDialogProps = {
  rows: number;
  setRows: (value: number) => void;
  setCols: (value: number) => void;
  onConfirmAddSeats: (type: ElementType, rows: number, cols: number) => void;
  cols: number;
  onClose: () => void;
  positionClasses?: string; // Tailwind CSS konumlandırma sınıfları (örn: 'top-0 right-0')
};

export const AddMultipleSeatDialog = ({
  rows,
  setRows,
  setCols,
  onConfirmAddSeats,
  cols,
  onClose,
  positionClasses = "top-0 right-0",
}: AddMultipleSeatDialogProps) => {
  const handleAddGrid = () => {
    const type = "section";
    onConfirmAddSeats(type, rows, cols);
    onClose();
  };

  return (
    <div
      className={`absolute w-64 bg-white p-4 rounded-lg shadow-xl z-50 ${positionClasses}`}
    >
      <div className="flex justify-end">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-3 text-gray-800">
        Add Multiple Seats
      </h3>
      <div className="mb-4 flex flex-col gap-2">
        <label className="flex items-center justify-between gap-2 text-sm text-gray-700">
          Row:
          <input
            type="number"
            min={1}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="flex items-center justify-between gap-2 text-sm text-gray-700">
          Column:
          <input
            type="number"
            min={1}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <button
          onClick={handleAddGrid}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-150"
        >
          Add Multiple Seats
        </button>
      </div>
    </div>
  );
};
