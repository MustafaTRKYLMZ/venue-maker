export const groupFields = (fields: string[]) => {
  const groups: Record<string, string[]> = {
    General: [],
    Position: [],
    Style: [],
  };

  fields.forEach((field) => {
    if (field.startsWith("position.")) {
      groups.Position.push(field);
    } else if (
      field.includes("fill") ||
      field.includes("stroke") ||
      field === "rotation"
    ) {
      groups.Style.push(field);
    } else {
      groups.General.push(field);
    }
  });

  return groups;
};
