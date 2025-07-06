import { Group, Rect, Text, Circle, Line, Transformer } from "react-konva";
import { Section } from "@/src/types/venue";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { RowElement } from "./RowElement";
import { GroupWrapper } from "../common/GroupWrapper";
import Konva from "konva";
import { useMapEditor } from "@/src/context/MapEditorContext";
import { Position } from "@/src/types/baseElement";
import { v4 as uuidv4 } from "uuid";
import { useKeyboard } from "@/src/hooks/useKeyboard";

interface Props {
  section: Section;
  isParentSelected: boolean;
  onClick: () => void;
  onDragEnd: (x: number, y: number) => void;
  onSeatClick: (seatId: string) => void;
  onTransformEnd: (props: {
    width?: number;
    height?: number;
    rotation?: number;
    position?: Position;
  }) => void;
}

export const SectionElement = ({
  section,
  isParentSelected,
  onClick,
  onDragEnd,
  onSeatClick,
  onTransformEnd,
}: Props) => {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const { venue, setVenue, selectedFloorId, selectedElement } = useMapEditor();
  const isElementSelected = section?.id === selectedElement?.id;

  const [dims, setDims] = useState({
    x: section.position.x,
    y: section.position.y,
    width: section.width,
    height: section.height,
    rotation: section.rotation,
  });
  const { isAltPressed } = useKeyboard();

  useEffect(() => {
    setDims({
      x: section.position.x,
      y: section.position.y,
      width: section.width,
      height: section.height,
      rotation: section.rotation,
    });
  }, [section]);

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

  const handleAltDragStart = () => {
    if (!isAltPressed || !selectedFloorId) return;

    const copiedSection = {
      ...section,
      id: uuidv4(),

      label: "Copy of " + (section?.label || "Section"),
      position: {
        x: dims.x + 20,
        y: dims.y + 20,
      },
    };

    const updatedVenue = {
      ...venue,
      floors: venue.floors.map((floor) =>
        floor.id === selectedFloorId
          ? {
              ...floor,
              sections: [...floor.sections, copiedSection],
            }
          : floor,
      ),
    };

    setVenue(updatedVenue);
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
        draggable={section.draggable && isParentSelected}
        onClick={onClick}
        onTap={onClick}
        onDragEnd={(e) => {
          const { x, y } = e.target.position();
          setDims((d) => ({ ...d, x, y }));
          onDragEnd(x, y);
        }}
        onDragStart={() => {
          handleAltDragStart();
        }}
        onTransformEnd={handleTransformEnd}
      >
        <Rect
          width={dims.width}
          height={dims.height}
          fill={section.fill}
          stroke="green"
          cornerRadius={4}
        />

        <Text
          text={section.label || "Section"}
          fontSize={14}
          fontStyle="bold"
          fill="#1e293b"
          x={8}
          y={8}
        />

        {section.rows.map((row) => (
          <RowElement key={row.id} row={row} onSeatClick={onSeatClick} />
        ))}
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
