import { useMapEditor } from "../context/MapEditorContext";
import { Floor, Row, Section } from "../types/venue";

export const VenueSummary = () => {
  const { venue } = useMapEditor();

  const floorCapacities =
    venue.floors?.map((floor) => {
      const totalSeats =
        floor?.sections?.flatMap(
          (section: Section) =>
            section.rows?.flatMap((row: Row) => row.seats || []) || [],
        ).length || 0;
      return {
        floorName: floor.name,
        capacity: totalSeats,
      };
    }) || [];

  const totalCapacity = floorCapacities.reduce(
    (acc, floor) => acc + floor.capacity,
    0,
  );

  return (
    <div className="flex flex-row items-start gap-8 p-2 border rounded-md bg-white shadow-sm">
      <div className="flex flex-row">
        <span className="font-semibold">Total Capacity: </span>
        <p>{totalCapacity}</p>
      </div>

      <div className="flex flex-col gap-1">
        {floorCapacities.map((floor, index) => (
          <div key={index} className="text-xs text-gray-600 p-1">
            <span className="font-medium">{floor.floorName}:</span>{" "}
            {floor.capacity} seats
          </div>
        ))}
      </div>
    </div>
  );
};
