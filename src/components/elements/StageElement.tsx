"use client";

import { Group, Rect, Text, Transformer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage as StageType } from "@/src/types/elements";
import { Position } from "@/src/types/baseElement";
import { useMapEditor } from "@/src/context/MapEditorContext";

interface Props {
  stage: StageType;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: {
    width?: number;
    height?: number;
    rotation?: number;
    position?: Position;
  }) => void;
  isParentSelected?: boolean;
}

export const StageElement = ({
  stage,
  isParentSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: Props) => {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const { selectedElement } = useMapEditor();
  const isElementSelected = stage?.id === selectedElement?.id;

  const [dims, setDims] = useState({
    x: stage.position.x,
    y: stage.position.y,
    width: stage.width,
    height: stage.height,
    rotation: stage.rotation || 0,
  });

  useEffect(() => {
    setDims({
      x: stage.position.x,
      y: stage.position.y,
      width: stage.width,
      height: stage.height,
      rotation: stage.rotation || 0,
    });
  }, [stage]);

  useEffect(() => {
    const tr = transformerRef.current;
    const group = groupRef.current;
    if (tr && group) {
      if (isElementSelected) tr.nodes([group]);
      else tr.nodes([]);
      tr.getLayer()?.batchDraw();
    }
  }, [isElementSelected]);

  const handleTransformEnd = () => {
    const group = groupRef.current;
    if (!group) return;

    const scaleX = group.scaleX();
    const scaleY = group.scaleY();
    const rotation = group.rotation();

    const newWidth = Math.max(20, dims.width * scaleX);
    const newHeight = Math.max(20, dims.height * scaleY);

    const newX = group.x();
    const newY = group.y();

    group.scaleX(1);
    group.scaleY(1);

    setDims({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
      rotation,
    });

    // onDragEnd(newX, newY);
    onTransformEnd({
      width: newWidth,
      height: newHeight,
      rotation,
      position: { x: newX, y: newY },
    });
  };

  return (
    <>
      <Group
        ref={groupRef}
        x={dims.x}
        y={dims.y}
        rotation={dims.rotation}
        offsetX={dims.width / 2}
        offsetY={dims.height / 2}
        draggable={stage.draggable && isParentSelected}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          const { x, y } = e.target.position();
          setDims((d) => ({ ...d, x, y }));
          onDragEnd(x, y);
        }}
        onTransformEnd={handleTransformEnd}
      >
        <Rect
          rotation={dims.rotation || 0}
          width={dims.width}
          height={dims.height}
          offsetX={dims.width / 2}
          offsetY={dims.height / 2}
          fill={stage.fill}
          stroke="green"
          cornerRadius={4}
        />
        {stage.label && (
          <Text
            text={stage.label}
            fontSize={16}
            fill="white"
            align="center"
            verticalAlign="middle"
            width={dims.width}
            height={dims.height}
            offsetX={dims.width / 2}
            offsetY={dims.height / 2}
          />
        )}
      </Group>

      {isParentSelected && isElementSelected && (
        <Transformer
          ref={transformerRef}
          anchorSize={8}
          borderDash={[3, 3]}
          rotateEnabled
          keepRatio={false}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "middle-left",
            "middle-right",
            "top-center",
            "bottom-center",
          ]}
        />
      )}
    </>
  );
};
