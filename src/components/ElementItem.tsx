import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FC } from "react";
import { containerStyle } from "../config/containerStyle";

export type ElementItemProps = {
  type: string;
  label: string;
  value: string | number;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
};
export const ElementItem: FC<ElementItemProps> = ({
  type,
  label,
  value,
  handleChange,
  name,
}) => {
  return (
    <div className={containerStyle}>
      <Label>{label}</Label>
      <Input type={type} name={name} value={value} onChange={handleChange} />
    </div>
  );
};
