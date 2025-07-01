import { Group } from "react-konva";
import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { ElementTransformer } from "./ElementTransformer";

interface Props {
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: {
    width?: number;
    height?: number;
    rotation?: number;
  }) => void;
  draggable?: boolean;
  position: { x: number; y: number };
  rotation?: number;
  children: React.ReactNode;
  elementId?: string;
}

export const GroupWrapper = ({
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
  draggable = false,
  position,
  rotation = 0,
  children,
  elementId,
}: Props) => {
  const shapeRef = useRef<Konva.Group>(null);

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      shapeRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group
        ref={shapeRef}
        x={position.x}
        y={position.y}
        rotation={rotation}
        draggable={draggable && isSelected}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
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
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;

          const box = node.getClientRect({ skipTransform: false });
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onTransformEnd({
            width: Math.max(10, box.width * scaleX),
            height: Math.max(10, box.height * scaleY),
            rotation: node.rotation(),
          });
        }}
      >
        {children}
      </Group>

      {isSelected && shapeRef.current && (
        <ElementTransformer selectedShapeRef={shapeRef} elementId={elementId} />
      )}
    </>
  );
};
