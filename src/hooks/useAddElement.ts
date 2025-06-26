// hooks/useAddElement.ts
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { MapElement } from "@/src/types/mapElement";
import { ElementType } from "@/src/types/element";

interface UseAddElementProps {
  setElements: React.Dispatch<React.SetStateAction<MapElement[]>>;
  handleSelectElements: (elements: MapElement[]) => void;
  setSelectedTool: (tool: ElementType | null) => void;
}

export const useAddElement = ({
  setElements,
  handleSelectElements,
  setSelectedTool,
}: UseAddElementProps) => {
  const addElementAtPosition = useCallback(
    (type: ElementType, position: { x: number; y: number }) => {
      const id = uuidv4();
      let newElement: MapElement | null = null;

      switch (type) {
        case "seat":
          newElement = {
            id: `seat-${id.substring(0, 4)}`,
            type: "seat",
            x: position.x - 15,
            y: position.y - 15,
            width: 30,
            height: 30,
            fill: "#4CAF50",
            text: "New Seat",
            fontSize: 14,
            draggable: true,
          };
          break;
        case "stage":
          newElement = {
            id: `stage-${id.substring(0, 4)}`,
            type: "stage",
            x: position.x - 100,
            y: position.y - 40,
            width: 200,
            height: 80,
            fill: "#607D8B",
            text: "New Stage",
            fontSize: 20,
            draggable: true,
          };
          break;
        case "text":
          newElement = {
            id: `text-${id.substring(0, 4)}`,
            type: "text",
            x: position.x - 50,
            y: position.y - 15,
            width: 100,
            height: 30,
            text: "New Text",
            fontSize: 18,
            fill: "black",
            draggable: true,
          };
          break;
        case "wall":
          newElement = {
            id: `wall-${id.substring(0, 4)}`,
            type: "wall",
            x: position.x - 100,
            y: position.y - 5,
            width: 200,
            height: 10,
            fill: "#795548",
            draggable: true,
            stroke: "#5D4037",
            strokeWidth: 2,
          };
          break;
        default:
          break;
      }

      if (newElement) {
        setElements((prev) => [...prev, newElement]);
        handleSelectElements([newElement]);
      } else {
        setSelectedTool(null);
      }
    },
    [setElements, handleSelectElements, setSelectedTool],
  );

  return { addElementAtPosition };
};
