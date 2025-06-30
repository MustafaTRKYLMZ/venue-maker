import { useCallback } from "react";
import { createVenueHierarchy } from "../utils/createVenueHierarchy";

export const useAddSeatsGrid = ({
  setElements,
  handleSelectElements,
}: {
  setElements: React.Dispatch<React.SetStateAction<any[]>>;
  handleSelectElements: (elements: any[]) => void;
}) => {
  const addSeatsGrid = useCallback(
    (position: { x: number; y: number }, rows: number, cols: number) => {
      const venue = createVenueHierarchy(position, rows, cols);

      setElements((prev) => [...prev, venue]);
      handleSelectElements([venue]);
    },
    [setElements, handleSelectElements],
  );

  return { addSeatsGrid };
};
