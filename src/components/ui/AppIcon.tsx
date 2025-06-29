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
        "w-5 h-5 flex items-center justify-center rounded",
        isActive ? "bg-primary text-white" : "text-blue-300 bg-transparent",
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};
