import { Group, Rect, Text, Circle } from "react-konva";
import { Section } from "@/src/types/venue";
import { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";
import { RowElement } from "./RowElement";

interface Props {
  section: Section;
  isSelected: boolean;
  onClick: () => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onSeatClick: (seatId: string) => void;
}

export const SectionElement = ({
  section,
  isSelected,
  onClick,
  onDragEnd,
  onSeatClick,
}: Props) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Group
      x={section.position.x}
      y={section.position.y}
      draggable={isSelected && section.draggable}
      onClick={(e) => {
        e.cancelBubble = true;
        onClick();
      }}
      onDragEnd={onDragEnd}
      onMouseEnter={(e) => {
        e.cancelBubble = true;
        e.target.getStage()?.container().style.setProperty("cursor", "pointer");
        setIsHover(true);
      }}
      onMouseLeave={(e) => {
        e.cancelBubble = true;
        e.target.getStage()?.container().style.setProperty("cursor", "default");
        setIsHover(false);
      }}
    >
      <Rect
        width={section.width}
        height={section.height}
        fill={isHover ? "#f1f5f9" : "#f8fafc"}
        stroke={isHover ? "#94a3b8" : "#cbd5e1"}
        strokeWidth={2}
        cornerRadius={8}
        shadowColor="black"
        shadowBlur={5}
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
  );
};
