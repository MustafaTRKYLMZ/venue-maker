// components/ui/Input.tsx
import { InputHTMLAttributes } from "react";
import { cn } from "@/src/utils/cn";

export const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={cn(
        "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition w-full",
        className,
      )}
      {...props}
    />
  );
};
