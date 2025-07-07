"use client";

import { Group, Transformer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Position } from "@/src/types/baseElement";
import { useMapEditor } from "@/src/context/MapEditorContext";
import { SelectedElement } from "@/src/types/element";
import React from "react";
import { KonvaEventObject } from "konva/lib/Node";

interface Props {
  element: SelectedElement;
  onSelect: (e: KonvaEventObject<MouseEvent>) => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: {
    width?: number;
    height?: number;
    rotation?: number;
    position?: Position;
  }) => void;
  isParentSelected?: boolean;
  children?: React.ReactNode;
  draggable?: boolean;
}

export const GroupWrapper = ({
  element,
  isParentSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
  children,
  draggable,
  ...props
}: Props) => {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const { selectedElements } = useMapEditor();
  const isElementSelected = selectedElements.some(
    (el) => el.id === element.id && el.type === element.type,
  );

  const [dims, setDims] = useState({
    x: element?.position.x || 0,
    y: element?.position.y || 0,
    width: element?.width || 100,
    height: element?.height || 100,
    rotation: element?.rotation || 0,
  });

  useEffect(() => {
    if (!element) return;
    setDims({
      x: element.position?.x || 0,
      y: element.position?.y || 0,
      width: element.width || 100,
      height: element.height || 100,
      rotation: element.rotation || 0,
    });
  }, [element]);

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

    onTransformEnd({
      width: newWidth,
      height: newHeight,
      rotation,
      position: { x: newX, y: newY },
    });
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...(child.props || {}),
        width: dims.width,
        height: dims.height,
      } as Partial<typeof child.props>);
    }
    return child;
  });

  return (
    <>
      <Group
        ref={groupRef}
        x={dims.x}
        y={dims.y}
        rotation={dims.rotation}
        offsetX={dims.width / 2}
        offsetY={dims.height / 2}
        draggable={draggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          const { x, y } = e.target.position();
          setDims((d) => ({ ...d, x, y }));
          onDragEnd(x, y);
        }}
        onTransformEnd={handleTransformEnd}
        {...props}
      >
        {childrenWithProps}
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
