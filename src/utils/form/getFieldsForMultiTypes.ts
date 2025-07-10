import { commonSectionSchema } from "@/src/config/schemas/commonSectionSchema";

export const getFieldsForMultiTypes = (types: string[]): string[] => {
  if (types.length === 1) {
    return commonSectionSchema[types[0]] ?? [];
  } else {
    const allFields = types.map((type) => commonSectionSchema[type] ?? []);
    return allFields.reduce((acc, fields) =>
      acc.filter((field) => fields.includes(field)),
    );
  }
};
