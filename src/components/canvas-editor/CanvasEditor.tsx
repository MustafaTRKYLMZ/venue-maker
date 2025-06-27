"use client";

import React, { FC, useState, useEffect, useRef } from "react";
import { Venue } from "@/src/types/venue";
import { Layer, Line, Stage } from "react-konva";

const GRID_SIZE = 50;

export type CanvasEditorProps = {
  venue: Venue;
  setVenue: (venue: Venue) => void;
};

export const CanvasEditor: FC<CanvasEditorProps> = ({ venue, setVenue }) => {
  const stageRef = useRef<any>(null);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridWidth = dimensions.width * 5;
  const gridHeight = dimensions.height * 5;

  const [isDragging, setIsDragging] = useState(false);

  const halfWidth = dimensions.width / 2;
  const halfHeight = dimensions.height / 2;

  const renderGrid = () => {
    const lines = [];

    const halfWidth = gridWidth / 2;
    const halfHeight = gridHeight / 2;

    // Dikey çizgiler
    for (let x = -halfWidth; x <= halfWidth; x += GRID_SIZE) {
      lines.push(
        <Line
          key={`vline-${x}`}
          points={[x, -halfHeight, x, halfHeight]}
          stroke="#ddd"
          strokeWidth={1}
          listening={false}
        />,
      );
    }

    // Yatay çizgiler
    for (let y = -halfHeight; y <= halfHeight; y += GRID_SIZE) {
      lines.push(
        <Line
          key={`hline-${y}`}
          points={[-halfWidth, y, halfWidth, y]}
          stroke="#ddd"
          strokeWidth={1}
          listening={false}
        />,
      );
    }

    return <>{lines}</>;
  };

  useEffect(() => {
    if (stageRef.current) {
      const container = stageRef.current.container();
      container.style.cursor = isDragging ? "grabbing" : "grab";
    }
  }, [isDragging]);

  return (
    <Stage
      width={dimensions.width}
      height={dimensions.height}
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e) => {
        setIsDragging(false);
        // Burada drag pozisyonunu tutabilirsin istersen
      }}
      x={0}
      y={0}
      ref={stageRef}
      style={{ backgroundColor: "#fafafa" }}
    >
      <Layer>{renderGrid()}</Layer>
    </Stage>
  );
};
