import React from "react";
import { Group, Rect, Shape } from "react-konva";
import { BaseElement } from "@/src/types/baseElement";
import { EdgeBendControls } from "./EdgeBendControls";
import { GroupEdgeBends } from "@/src/types/groupEdgeBends";
import { applyEdgeBendsToChild, drawBentGroupShape } from "@/src/utils/helpers";
import { Section as SectionType, Row, Venue } from "@/src/types/venue";
import Konva from "konva";
import { Rows } from "./Rows";

type SectionProps = {
  setElements: (el: Venue[]) => void;
  handleElementClick: (
    e: Konva.KonvaEventObject<MouseEvent>,
    el: BaseElement,
  ) => void;
  handleTransformEnd: (e: SectionType, el: BaseElement) => void;
  selectedIds?: string[];
  groupEdgeBends?: GroupEdgeBends;
  section: SectionType;
  isSelected?: boolean;
  setGroupEdgeBends: React.Dispatch<React.SetStateAction<GroupEdgeBends>>;
  elementRefs?: React.MutableRefObject<Record<string, any>>;
};

export const Section: React.FC<SectionProps> = ({
  handleElementClick,
  setElements,
  handleTransformEnd,
  setGroupEdgeBends,
  selectedIds = [],
  groupEdgeBends,
  section,
  isSelected,
  elementRefs,
}) => {
  // const offsetX = Math.max(0, -(groupEdgeBends?.left ?? 0));
  // const offsetY = Math.max(0, -(groupEdgeBends?.top ?? 0));
  // const extendRight = Math.max(0, groupEdgeBends?.right || 0);
  // const extendBottom = Math.max(0, groupEdgeBends?.bottom || 0);

  // const totalWidth = section.width + offsetX + extendRight;
  // const totalHeight = section.height + offsetY + extendBottom;
  console.log("Rendering Section:", section);
  return (
    <Group
      key={section.id}
      x={section.position.x}
      y={section.position.y}
      draggable
      ref={(node) => {
        if (node) {
          elementRefs?.current && (elementRefs.current[section.id] = node);
        } else {
          elementRefs?.current && delete elementRefs.current[section.id];
        }
      }}
      onClick={(e) => {
        e.cancelBubble = true;
        handleElementClick(e as Konva.KonvaEventObject<MouseEvent>, section);
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        handleElementClick(e as Konva.KonvaEventObject<MouseEvent>, section);
      }}
    >
      {/* Transparent base rect for interaction */}
      <Rect
        width={section.width}
        height={section.height}
        fill="transparent"
        listening
        onClick={(e) => {
          e.cancelBubble = true;
          handleElementClick(e as Konva.KonvaEventObject<MouseEvent>, section);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          handleElementClick(e as Konva.KonvaEventObject<MouseEvent>, section);
        }}
      />

      {/* Custom shape outline */}
      <Shape
        listening
        onClick={(e) => {
          e.cancelBubble = true;
          handleElementClick(e, section);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          handleElementClick(e as Konva.KonvaEventObject<MouseEvent>, section);
        }}
        sceneFunc={(ctx) => {
          drawBentGroupShape({
            ctx: ctx as unknown as CanvasRenderingContext2D,
            isSelected,
            b: groupEdgeBends || { top: 0, right: 0, bottom: 0, left: 0 },
            el: section,
          });
        }}
      />

      {/* Render Rows and Seats */}
      {section.rows?.map((row: Row) => {
        const rowPos = applyEdgeBendsToChild(
          row,
          section,
          groupEdgeBends || { top: 0, right: 0, bottom: 0, left: 0 },
        );

        return (
          <Rows
            key={row.id}
            row={row}
            rowPos={rowPos}
            el={section}
            selectedIds={selectedIds}
            handleElementClick={handleElementClick}
            setElements={(elements) => setElements(elements as Venue[])}
            elementRefs={elementRefs}
            handleTransformEnd={(el, row) => handleTransformEnd(section, el)}
          />
        );
      })}

      {/* Edge control if selected */}
      {isSelected && (
        <EdgeBendControls
          el={section}
          groupEdgeBends={
            groupEdgeBends || { top: 0, right: 0, bottom: 0, left: 0 }
          }
          setGroupEdgeBends={setGroupEdgeBends}
        />
      )}
    </Group>
  );
};
