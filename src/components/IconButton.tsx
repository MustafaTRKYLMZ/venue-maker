// src/components/IconButton.tsx
import React, { ButtonHTMLAttributes } from "react";
import { IconType } from "react-icons"; // Import IconType for type checking icons

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  Icon: IconType; // The React Icon component itself (e.g., FaUndo)
  tooltipText: string;
  iconSize?: number; // Optional prop for icon size
  isLoading?: boolean; // Optional prop for loading state (e.g., for Save button)
  loadingText?: string; // Optional text when loading
}

export const IconButton: React.FC<IconButtonProps> = ({
  Icon,
  tooltipText,
  iconSize = 20, // Default icon size
  isLoading = false,
  loadingText = "",
  className = "",
  children, // To capture any text content for dynamic buttons like "Save/Saving..."
  ...rest
}) => {
  return (
    <div className="relative flex items-center group">
      <button
        className={`p-2 rounded-md shadow transition flex items-center justify-center ${className}`}
        {...rest} // Spreads all other button props (onClick, disabled, etc.)
      >
        {isLoading && loadingText ? (
          <span className="flex items-center space-x-1">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{loadingText}</span>
          </span>
        ) : (
          <>
            <Icon size={iconSize} />
            {children}{" "}
            {/* Render children if present, for "Save" or "Publish" with text */}
          </>
        )}
      </button>
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
        {tooltipText}
      </span>
    </div>
  );
};
