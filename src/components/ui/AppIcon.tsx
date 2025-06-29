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
          ? "bg-primary text-white bg-blue-600 hover:bg-blue-700"
          : "text-blue-700 bg-transparent",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};
