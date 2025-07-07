import { SelectedElement } from "@/src/types/element";

export const flattenObject = (
  obj: Record<string, SelectedElement[]>,
  prefix = "",
): Record<string, any> => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.assign(acc, flattenObject(value, fullKey));
      } else {
        acc[fullKey] = value;
      }
      return acc;
    },
    {} as Record<string, SelectedElement[]>,
  );
};
