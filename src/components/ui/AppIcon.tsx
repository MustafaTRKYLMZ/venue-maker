import { cn } from "@/src/utils/cn";
import { HTMLAttributes } from "react";

interface AppIconProps extends HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const AppIcon = ({
  className,
  children,
  isActive = false,
  style,
  ...props
}: AppIconProps) => {
  return (
    <div
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded",
        isActive
          ? "bg-primary text-orange bg-blue-300 hover:bg-blue-500"
          : "text-orange-700 bg-transparent",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};
