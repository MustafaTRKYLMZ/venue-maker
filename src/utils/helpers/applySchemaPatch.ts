export const applySchemaPatch = (
  original: any,
  patch: Record<string, any>,
  type: string,
  schema: Record<string, string[]>,
): any => {
  const allowedKeys = schema[type] ?? [];

  const filteredPatch = Object.fromEntries(
    Object.entries(patch).filter(
      ([key]) => allowedKeys.includes(key) && patch[key] !== undefined,
    ),
  );

  return {
    ...original,
    ...filteredPatch,
  };
};
