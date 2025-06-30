import React, { FC } from "react";
import Konva from "konva";
import { Group } from "react-konva";
import { Seat } from "./Seat";
import { Row, Seat as SeatType, Section } from "@/src/types/venue";
import { BaseElement } from "@/src/types/baseElement";

export type RowsProps = {
  row: Row;
  el: Section;
  rowPos: { position: { x: number; y: number } };
  selectedIds: string[];
  handleElementClick: (
    e: Konva.KonvaEventObject<MouseEvent>,
    el: BaseElement | SeatType,
  ) => void;
  setElements: React.Dispatch<React.SetStateAction<BaseElement[]>>;
  elementRefs?: React.MutableRefObject<Record<string, Konva.Node | null>>;
  handleTransformEnd: (el: BaseElement, row: Row) => void;
};

export const Rows: FC<RowsProps> = ({
  row,
  rowPos,
  el,
  selectedIds,
  handleElementClick,
  setElements,
  elementRefs,
  handleTransformEnd,
}) => {
  return (
    <Group
      key={row.id}
      x={rowPos.position.x}
      y={rowPos.position.y}
      ref={(node) => {
        if (node) {
          elementRefs?.current && (elementRefs.current[row.id] = node);
        } else {
          elementRefs?.current && delete elementRefs.current[row.id];
        }
      }}
      onClick={(e) => {
        e.cancelBubble = true;
        handleElementClick(e as Konva.KonvaEventObject<MouseEvent>, row);
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        handleElementClick(e as Konva.KonvaEventObject<MouseEvent>, row);
      }}
      onDragEnd={(e) => {
        const node = e.target;
        const updated = {
          ...row,
          position: { x: node.x(), y: node.y() },
        };

        // Bu update mevcut yapıya göre işe yaramayabilir; üst seviyede yönetilmesi gerekir
        setElements((prev) => {
          const updatedList = JSON.parse(JSON.stringify(prev));
          for (const venue of updatedList) {
            for (const floor of venue.floors || []) {
              for (const section of floor.sections || []) {
                const rowIndex = section.rows?.findIndex(
                  (r: Row) => r.id === row.id,
                );
                if (rowIndex !== undefined && rowIndex >= 0) {
                  section.rows[rowIndex] = updated;
                }
              }
            }
          }
          return updatedList;
        });
      }}
      onTransformEnd={() => handleTransformEnd(el, row)}
    >
      {row.seats?.map((seat: SeatType) => (
        <Seat
          key={seat.id}
          el={seat}
          selectedIds={selectedIds}
          handleElementClick={(e, id) => {
            const seatElement = row.seats.find((seat) => seat.id === id);
            if (seatElement) {
              handleElementClick(
                e as Konva.KonvaEventObject<MouseEvent>,
                seatElement,
              );
            }
          }}
        />
      ))}
    </Group>
  );
};
