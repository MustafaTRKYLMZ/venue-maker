// hooks/useAddElement.ts
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { BaseElement } from "@/src/types/baseElement";
import { ElementType } from "@/src/types/element";
import { ToolType } from "../app/editor/[mapId]/page";
import { Venue } from "../types/venue";
import { Tool } from "firebase/ai";

interface UseAddElementProps {
  setElements: React.Dispatch<React.SetStateAction<BaseElement[]>>;
  handleSelectElements: (elements: BaseElement[]) => void;
  setSelectedTool: (tool: ToolType | null) => void;
}

export const useAddElement = ({
  setElements,
  handleSelectElements,
  setSelectedTool,
}: UseAddElementProps) => {
  const addElementAtPosition = useCallback(
    (type: string, position: { x: number; y: number }) => {
      const id = uuidv4();
      let newElement: BaseElement | null = null;
      console.log("use add element at type", type, "at position", position);
      switch (type) {
        case "seat":
          newElement = {
            id: `seat-${id.substring(0, 4)}`,
            type: "seat",
            position: {
              x: position.x - 15,
              y: position.y - 15,
              row: 0,
              col: 0,
            },

            width: 30,
            height: 30,
            fill: "#4CAF50",
            text: "New Seat",
            fontSize: 14,
            draggable: true,
          } as BaseElement;
          break;
        case "stage":
          newElement = {
            id: `stage-${id.substring(0, 4)}`,
            type: "stage",
            position: {
              x: position.x - 100,
              y: position.y - 40,
              row: 0,
              col: 0,
            },

            width: 200,
            height: 80,
            fill: "#607D8B",
            text: "New Stage",
            fontSize: 20,
            draggable: true,

            label: "Stage Label",
          };
          break;
        case "text":
          newElement = {
            id: `text-${id.substring(0, 4)}`,
            type: "text",
            position: {
              x: position.x - 50,
              y: position.y - 15,
              row: 0,
              col: 0,
            },

            width: 100,
            height: 30,
            text: "New Text",
            fontSize: 18,
            fill: "black",
            draggable: true,
            label: "Text Label",
          };
          break;
        case "wall":
          newElement = {
            id: `wall-${id.substring(0, 4)}`,
            type: "wall",
            position: {
              x: position.x - 100,
              y: position.y - 5,
              row: 0,
              col: 0,
            },

            width: 200,
            height: 10,
            fill: "#795548",
            draggable: true,
            stroke: "#5D4037",
            strokeWidth: 2,
            label: "Wall Label",
            fontSize: 12,
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
