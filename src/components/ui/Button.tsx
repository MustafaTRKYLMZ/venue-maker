import { cn } from "@/src/utils/cn";
import React from "react";

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    isSelected?: boolean;
  }
>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isSelected = false,
      ...props
    },
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center rounded-md font-medium transition";

    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 w-full",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      ghost:
        "bg-transparent hover:bg-transparent hover:text-blue-500 text-gray-700",
    };

    const selectedVariants = {
      primary: "bg-blue-800 text-white w-full",
      secondary: "bg-gray-400 text-gray-900",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-700 p-0",
    };

    const sizes = {
      sm: "px-2 py-1 text-sm",
      md: "px-3 py-2 text-base",
      lg: "px-4 py-2 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          base,
          isSelected ? selectedVariants[variant] : variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
