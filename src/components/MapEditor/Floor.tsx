import React, { FC } from "react";
import { Group } from "react-konva";
import Konva from "konva";

import {
  Section as SectionType,
  Venue,
  Floor as FloorType,
} from "@/src/types/venue";
import { BaseElement } from "@/src/types/baseElement";
import { GroupEdgeBends } from "@/src/types/groupEdgeBends";
import { Section } from "./Section";
//import { updateNestedElement } from "@/src/utils/helpers"; // Bu fonksiyon doğruysa

type FloorProps = {
  el: FloorType;
  selectedIds: string[];
  elementRefs: React.MutableRefObject<Record<string, Konva.Node | null>>;
  handleElementClick: (
    e: Konva.KonvaEventObject<MouseEvent>,
    el: BaseElement,
  ) => void;
  setElements: React.Dispatch<React.SetStateAction<Venue[]>>;
  handleTransformEnd: (section: SectionType, el: BaseElement) => void;
  groupEdgeBends?: GroupEdgeBends;
  setGroupEdgeBends: React.Dispatch<React.SetStateAction<GroupEdgeBends>>;
};

export const Floor: FC<FloorProps> = ({
  el: floor,
  selectedIds,
  elementRefs,
  handleElementClick,
  setElements,
  handleTransformEnd,
  groupEdgeBends,
  setGroupEdgeBends,
}) => {
  return (
    <Group
      x={floor.position.x}
      y={floor.position.y}
      draggable
      ref={(node) => {
        if (node) elementRefs.current[floor.id] = node;
        else delete elementRefs.current[floor.id];
      }}
      onClick={(e) => {
        e.cancelBubble = true;
        handleElementClick(e, floor);
      }}
      onDragEnd={(e) => {
        const node = e.target;
        const newX = node.x();
        const newY = node.y();

        // setElements((prev) =>
        //   updateNestedElement(
        //     floor.id,
        //     (old) => ({
        //       ...old,
        //       position: {
        //         ...old.position,
        //         x: newX,
        //         y: newY,
        //       },
        //     }),
        //     prev
        //   )
        // );
      }}
    >
      {floor.sections?.map((section) => (
        <Section
          key={section.id}
          section={section}
          selectedIds={selectedIds}
          elementRefs={elementRefs}
          handleElementClick={handleElementClick}
          setElements={setElements}
          handleTransformEnd={handleTransformEnd}
          setGroupEdgeBends={setGroupEdgeBends}
          groupEdgeBends={groupEdgeBends}
          isSelected={selectedIds.includes(section.id)}
        />
      ))}
    </Group>
  );
};
