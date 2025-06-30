"use client";

import { useRef, useEffect } from "react";
import { Group, Rect, Text, Transformer } from "react-konva";
import Konva from "konva";
import { Stage as StageType } from "@/src/types/elements";
import { useTheme } from "next-themes";
import { useMapEditor } from "@/src/context/MapEditorContext";
import { ElementTransformer } from "./ElementTransformer";

interface Props {
  stage: StageType;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: {
    width?: number;
    height?: number;
    rotation?: number;
  }) => void;
}

export const StageElement = ({
  stage,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: Props) => {
  const shapeRef = useRef<Konva.Group>(null);
  const { setSelectedElement } = useMapEditor();
  const transformerRef = useRef<Konva.Transformer>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group
        ref={shapeRef}
        x={stage.position.x}
        y={stage.position.y}
        rotation={stage.rotation}
        draggable={stage.draggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onDragEnd(e.target.x(), e.target.y());
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          if (!node) return;

          const rect = node.findOne("Rect") as Konva.Rect;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale to 1, apply actual size
          node.scaleX(1);
          node.scaleY(1);

          onTransformEnd({
            width: Math.max(10, rect.width() * scaleX),
            height: Math.max(10, rect.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
        onMouseEnter={(e) => {
          e.target
            .getStage()
            ?.container()
            .style.setProperty("cursor", "pointer");
        }}
        onMouseLeave={(e) => {
          e.target
            .getStage()
            ?.container()
            .style.setProperty("cursor", "default");
        }}
      >
        <Rect
          width={stage.width}
          height={stage.height}
          fill={stage.fill}
          stroke="green"
        />
        <Text
          text={stage.label}
          fontSize={stage.fontSize}
          fill={theme === "dark" ? "white" : "black"}
          x={stage.width / 2 - (stage.label.length * stage.fontSize) / 4}
          y={stage.height / 2 - stage.fontSize / 2}
        />
      </Group>

      {isSelected && (
        <ElementTransformer selectedShapeRef={shapeRef} elementId={stage?.id} />
      )}
    </>
  );
};
