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
    gap?: number,
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
  return (
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
        onClick={() => addSeatsGrid(50, 50, rows, cols, 40, 40)}
        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-150"
      >
        Add Multiple Seats
      </button>
    </div>
  );
};
