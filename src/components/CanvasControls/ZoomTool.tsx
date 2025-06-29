"use client";

import { FaMagnifyingGlassMinus, FaMagnifyingGlassPlus } from "react-icons/fa6";
import { useCanvasEditor } from "../canvas-editor/CanvasEditorContext";

export const ZoomTool = () => {
  const { zoom, setZoom } = useCanvasEditor();

  const handleZoomChange = (value: number) => {
    const newValue = Math.min(200, Math.max(25, value));
    setZoom(newValue);
  };

  const increaseZoom = () => {
    handleZoomChange(zoom + 5);
  };

  const decreaseZoom = () => {
    handleZoomChange(zoom - 5);
  };

  return (
    <div className="fixed bottom-4 right-4 w-56 h-16 bg-transparent bg-opacity-90 rounded-lg shadow-lg p-2 flex items-center justify-between gap-2 z-50">
      <button
        onClick={decreaseZoom}
        aria-label="Zoom Out"
        className="w-8 h-8 flex items-center justify-center rounded-md text-blue-600 hover:bg-blue-500 hover:text-white transition-colors"
      >
        <FaMagnifyingGlassMinus />
      </button>
      <input
        type="range"
        min={25}
        max={200}
        step={5}
        value={zoom}
        onChange={(e) => handleZoomChange(Number(e.target.value))}
        className="flex-1 accent-blue-500"
        aria-label="Zoom"
      />
      <button
        onClick={increaseZoom}
        aria-label="Zoom In"
        className="w-8 h-8 flex items-center justify-center rounded-md text-blue-600 hover:bg-blue-500 hover:text-white transition-colors"
      >
        <FaMagnifyingGlassPlus />
      </button>
      <div className="text-sm text-gray-700 w-10 text-right"> %{zoom} </div>
    </div>
  );
};
