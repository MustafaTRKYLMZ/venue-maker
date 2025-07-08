import { SelectedElement } from "@/src/types/element";

export const flattenObject = (
  obj: Record<string, any>,
  prefix = "",
): Record<string, string | number | boolean | null | undefined> => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        Object.assign(acc, flattenObject(value, fullKey));
      } else {
        acc[fullKey] = value;
      }

      return acc;
    },
    {} as Record<string, string | number | boolean | null | undefined>,
  );
};
