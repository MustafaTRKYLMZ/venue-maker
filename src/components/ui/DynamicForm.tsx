// components/ui/DynamicForm.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { containerStyle } from "@/src/config/containerStyle";

type DynamicFormProps = {
  data: Record<string, any>;
  hiddenKeys?: string[];
  onChange: (name: string, value: any) => void;
};

const flattenObject = (
  obj: any,
  parentKey = "",
  result: Record<string, any> = {},
): Record<string, any> => {
  for (const key in obj) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      flattenObject(obj[key], fullKey, result);
    } else {
      result[fullKey] = obj[key];
    }
  }
  return result;
};

export const DynamicForm: React.FC<DynamicFormProps> = ({
  data,
  hiddenKeys = [],
  onChange,
}) => {
  const flatData = flattenObject(data);

  return (
    <>
      {Object.entries(flatData)
        .filter(([key]) => !hiddenKeys.includes(key))
        .map(([key, value]) => {
          let inputType: string = "text";
          if (typeof value === "number") inputType = "number";
          if (key.includes("fill") || key.includes("stroke"))
            inputType = "color";

          return (
            <div key={key} className={containerStyle}>
              <Label className="block text-sm text-gray-700">{key}</Label>
              <Input
                type={inputType}
                name={key}
                value={value}
                onChange={(e) =>
                  onChange(
                    key,
                    inputType === "number"
                      ? parseFloat(e.target.value) || 0
                      : e.target.value,
                  )
                }
              />
            </div>
          );
        })}
    </>
  );
};
