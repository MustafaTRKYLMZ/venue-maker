import { Group, Rect, Text, Circle, Line } from "react-konva";
import { Section } from "@/src/types/venue";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { RowElement } from "./RowElement";
import { GroupWrapper } from "../common/GroupWrapper";
import Konva from "konva";

interface Props {
  section: Section;
  isSelected: boolean;
  onClick: () => void;
  onDragEnd: (x: number, y: number) => void;
  onSeatClick: (seatId: string) => void;
  onTransformEnd: (props: {
    width?: number;
    height?: number;
    rotation?: number;
  }) => void;
}

export const SectionElement = ({
  section,
  isSelected,
  onClick,
  onDragEnd,
  onSeatClick,
  onTransformEnd,
}: Props) => {
  const [isHover, setIsHover] = useState(false);
  const shapeRef = useRef<Konva.Group>(null);

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      shapeRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);
  return (
    <GroupWrapper
      isSelected={isSelected}
      onSelect={onClick}
      onDragEnd={onDragEnd}
      onTransformEnd={() => {
        const node = shapeRef.current;
        if (!node) return;

        const width = section.width; // or stored section width
        const height = section.height; // or stored section height

        const rotation = node.rotation();

        onTransformEnd({
          width,
          height,
          rotation,
        });
      }}
      draggable={section.draggable}
      position={section.position}
      rotation={section.rotation ?? 0}
      elementId={section.id}
    >
      <Rect
        width={section.width}
        height={section.height}
        fill={isHover ? "#f1f5f9" : "#f8fafc"}
        stroke="transparent"
        // stroke={isHover ? "#94a3b8" : "#cbd5e1"}
        // strokeWidth={2}
        cornerRadius={8}
        // shadowColor="black"
        shadowBlur={5}
      />
      <Group>
        {/* Top border */}
        <Line
          points={[0, 0, section.width, 0]}
          stroke="#cbd5e1"
          strokeWidth={2}
        />
        {/* Right border */}
        <Line
          points={[section.width, 0, section.width, section.height]}
          stroke="#cbd5e1"
          strokeWidth={2}
        />
        {/* Bottom border */}
        <Line
          points={[0, section.height, section.width, section.height]}
          stroke="#cbd5e1"
          strokeWidth={2}
        />
        {/* Left border */}
        <Line
          points={[0, 0, 0, section.height]}
          stroke="#cbd5e1"
          strokeWidth={2}
        />
      </Group>

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
    </GroupWrapper>
  );
};
