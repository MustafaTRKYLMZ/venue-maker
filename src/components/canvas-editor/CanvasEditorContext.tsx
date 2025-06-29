import React, { createContext, useContext, useState, ReactNode } from "react";

type CanvasEditorContextType = {
  rotation: number;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

const CanvasEditorContext = createContext<CanvasEditorContextType | undefined>(
  undefined
);

export const useCanvasEditor = () => {
  const context = useContext(CanvasEditorContext);
  if (!context) {
    throw new Error(
      "useCanvasEditor must be used within a CanvasEditorProvider"
    );
  }
  return context;
};

type Props = { children: ReactNode };

export const CanvasEditorProvider = ({ children }: Props) => {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <CanvasEditorContext.Provider
      value={{
        rotation,
        setRotation,
        zoom,
        setZoom,
        isDragging,
        setIsDragging,
      }}
    >
      {children}
    </CanvasEditorContext.Provider>
  );
};
