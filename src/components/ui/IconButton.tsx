import React from "react";
import { IconType } from "react-icons";
import { Button } from "./Button";
import { LoadingSpinner } from "./LoadingSpinner";
import { AppIcon } from "./AppIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ToolTip";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactElement<IconType>;
  tooltipText: string;
  isLoading?: boolean;
  loadingText?: string;
  isSelected?: boolean;
}

export const IconButton = ({
  icon,
  tooltipText,
  isLoading,
  isSelected = false,
  loadingText,
  children,
  ...props
}: IconButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button {...props} variant="ghost" isSelected={isSelected}>
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <LoadingSpinner size={20} color="text-white" />
                <span>{loadingText}</span>
              </span>
            ) : (
              <>
                <AppIcon isActive={isSelected}>{icon}</AppIcon>
                {children && <span className="ml-2">{children}</span>}
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
