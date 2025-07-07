import { SelectedElement } from "@/src/types/element";
import { flattenObject } from "./flattenObject";

export const getCommonFields = (
  elements: Record<string, SelectedElement[]>[],
): string[] => {
  if (elements.length === 0) return [];
  return elements
    .map((el) => Object.keys(flattenObject(el)))
    .reduce((a, b) => a.filter((key) => b.includes(key)));
};
