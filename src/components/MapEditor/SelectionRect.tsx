import Konva from "konva";
import React from "react";
import { Rect } from "react-konva";

export const SelectionRect = React.forwardRef<Konva.Rect, { visible: boolean }>(
  ({ visible }, ref) => {
    return <Rect ref={ref} visible={visible} fill="rgba(0,0,255,0.2)" />;
  },
);
