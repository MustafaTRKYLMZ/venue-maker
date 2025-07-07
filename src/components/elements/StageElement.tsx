"use client";

import { Group, Rect, Text, Transformer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage } from "@/src/types/elements";
import { Position } from "@/src/types/baseElement";
import { useMapEditor } from "@/src/context/MapEditorContext";
import { GroupWrapper } from "../common/GroupWrapper";
import { KonvaEventObject } from "konva/lib/Node";

interface Props {
  stage: Stage;
  isParentSelected: boolean;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  onDragEnd: (x: number, y: number) => void;
  onTransformEnd: (props: {
    width?: number;
    height?: number;
    rotation?: number;
  }) => void;
  width?: number;
  height?: number;
  rotation?: number;
}

export const StageElement = ({
  stage,
  isParentSelected,
  onClick,
  onDragEnd,
  onTransformEnd,
  width,
  height,
}: Props) => {
  const w = width ?? stage.width;
  const h = height ?? stage.height;

  return (
    <GroupWrapper
      element={stage}
      isParentSelected={isParentSelected}
      onSelect={onClick}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      draggable={stage.draggable && isParentSelected}
    >
      <Rect
        width={w}
        height={h}
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
        />
      )}
    </GroupWrapper>
  );
};
