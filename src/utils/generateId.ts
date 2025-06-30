export const generateId = (prefix: string): string => {
  return `${prefix}-${crypto.randomUUID()}`;
};
