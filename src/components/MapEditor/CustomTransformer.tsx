import Konva from "konva";
import { FC } from "react";
import { Transformer } from "react-konva";

export type CustomTransformerProps = {
  transformerRef: React.RefObject<Konva.Transformer>;
};

export const CustomTransformer: FC<CustomTransformerProps> = ({
  transformerRef,
}) => {
  return (
    <Transformer
      ref={transformerRef}
      rotateEnabled
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
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
    />
  );
};
