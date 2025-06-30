"use client";

import { useEffect, useRef, useState } from "react";
import { FaCompactDisc } from "react-icons/fa";
import { useCanvasEditor } from "../canvas-editor/CanvasEditorContext";

export const RotateTool = ({}: {}) => {
  const [angle, setAngle] = useState(35);
  const [activeSide, setActiveSide] = useState<"left" | "right" | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { setRotation } = useCanvasEditor();

  const startRotate = (direction: "left" | "right") => {
    stopRotate();
    setActiveSide(direction);

    intervalRef.current = setInterval(() => {
      const delta = direction === "left" ? -3 : 3;
      setAngle((prev) => prev + delta);
      setRotation((prev) => prev + delta);
    }, 50);
  };

  const stopRotate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveSide(null);
  };

  useEffect(() => {
    document.addEventListener("mouseup", stopRotate);
    document.addEventListener("mouseleave", stopRotate);
    document.addEventListener("touchend", stopRotate);

    return () => {
      document.removeEventListener("mouseup", stopRotate);
      document.removeEventListener("mouseleave", stopRotate);
      document.removeEventListener("touchend", stopRotate);
    };
  }, []);

  const containerBgClass =
    activeSide === "left" || activeSide === "right"
      ? "bg-blue-100"
      : "bg-white-400";

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 z-50">
      <div
        className={`relative w-full h-full ${containerBgClass} bg-opacity-80 p-2 rounded-full shadow-md flex items-center justify-center overflow-hidden`}
      >
        <div
          className={`absolute left-0 top-0 bottom-0 w-1/2 rounded-l-full transition-all duration-200 pointer-events-none z-0 ${
            activeSide === "left" ? "bg-blue-700 opacity-60" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-1/2 rounded-r-full transition-all duration-200 pointer-events-none z-0 ${
            activeSide === "right" ? "bg-blue-700 opacity-80" : "opacity-0"
          }`}
        />
        <FaCompactDisc
          className="w-16 h-16 text-gray-700 z-10"
          style={{
            transform: `rotate(${angle}deg)`,
            transition: "transform 0.1s linear",
            color: "blue",
          }}
        />

        {/* LEFT SIDE */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/2 z-20 cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault();
            startRotate("left");
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            startRotate("left");
          }}
        />
        {/* RIGHT SIDE */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 z-20 cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault();
            startRotate("right");
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            startRotate("right");
          }}
        />
      </div>
    </div>
  );
};
