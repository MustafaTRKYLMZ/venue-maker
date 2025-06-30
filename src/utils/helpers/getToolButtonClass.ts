// utils.ts veya helpers.ts

import { ElementType, ToolType } from "@/src/types/element";

export function getToolButtonClass(
  selectedType: string | null,
  currentType: string,
) {
  const baseClass =
    "text-left px-4 py-2 rounded-md justify-start flex items-center gap-2";
  const defaultStyle = "bg-gray-200 hover:bg-gray-300 text-gray-800";
  const selectedStyle = "bg-blue-600 text-white";

  return selectedType === currentType
    ? `${baseClass} ${selectedStyle}`
    : `${baseClass} ${defaultStyle}`;
}
