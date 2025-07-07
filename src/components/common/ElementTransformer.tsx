import { Transformer } from "react-konva";
import { useEffect, useRef } from "react";
import Konva from "konva";
import { useMapEditor } from "@/src/context/MapEditorContext";

interface Props {
  selectedShapeRef: React.RefObject<Konva.Group | null>;
  elementId?: string;
}

export const ElementTransformer = ({ selectedShapeRef, elementId }: Props) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const { selectedElements } = useMapEditor();
  const visible = selectedElements.some((el) => el.id === elementId);

  useEffect(() => {
    if (visible && selectedShapeRef.current && transformerRef.current) {
      requestAnimationFrame(() => {
        transformerRef.current!.nodes([selectedShapeRef.current!]);
        transformerRef.current!.getLayer()?.batchDraw();
      });
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [visible, selectedShapeRef, selectedElements]);

  return (
    <Transformer
      ref={transformerRef}
      visible={visible}
      rotateEnabled={true}
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
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 10 || newBox.height < 10) return oldBox;
        return newBox;
      }}
    />
  );
};
