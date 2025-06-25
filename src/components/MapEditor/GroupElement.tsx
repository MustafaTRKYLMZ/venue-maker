import React from "react";
import { Group, Rect, Text, Circle, Shape } from "react-konva";
import { MapElement } from "@/src/types/mapElement";
import { Seat } from "./Seat";
import { EdgeBendControls } from "./EdgeBendControls";
import { GroupEdgeBends } from "@/src/types/groupEdgeBends";
import { applyEdgeBendsToChild, drawBentGroupShape } from "@/src/utils/helpers";

type GroupElementProps = {
  setElements: React.Dispatch<React.SetStateAction<MapElement[]>>;
  handleElementClick: (e: any, el: MapElement) => void;
  handleTransformEnd: (e: any, el: MapElement) => void;
  selectedIds?: string[];
  groupEdgeBends?: GroupEdgeBends;
  el: MapElement;
  isSelected?: boolean;
  setGroupEdgeBends: React.Dispatch<React.SetStateAction<GroupEdgeBends>>;
  elementRefs?: React.MutableRefObject<Record<string, any>>;
};

export const GroupElement: React.FC<GroupElementProps> = ({
  handleElementClick,
  setElements,
  handleTransformEnd,
  setGroupEdgeBends,
  selectedIds = [],
  groupEdgeBends,
  el,
  isSelected,
  elementRefs,
}) => {
  const offsetX = Math.max(0, -(groupEdgeBends?.left ?? 0));
  const offsetY = Math.max(0, -(groupEdgeBends?.top ?? 0));
  const extendRight = Math.max(0, groupEdgeBends?.right || 0);
  const extendBottom = Math.max(0, groupEdgeBends?.bottom || 0);

  const totalWidth = el.width + offsetX + extendRight;
  const totalHeight = el.height + offsetY + extendBottom;

  return (
    <Group
      key={el.id}
      x={el.x}
      y={el.y}
      draggable
      ref={(node) => {
        if (node) {
          if (elementRefs?.current) {
            elementRefs.current[el.id] = node;
          }
        } else {
          if (elementRefs?.current) {
            delete elementRefs.current[el.id];
          }
        }
      }}
      onClick={(e) => {
        e.cancelBubble = true;
        handleElementClick(e, el);
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        handleElementClick(e, el);
      }}
    >
      <Rect
        width={el.width}
        height={el.height}
        fill="transparent"
        listening={true}
        onClick={(e) => {
          e.cancelBubble = true;
          handleElementClick(e, el);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          handleElementClick(e, el);
        }}
      />
      <Shape
        width={totalWidth}
        height={totalHeight}
        listening={true}
        onClick={(e) => {
          e.cancelBubble = true;
          handleElementClick(e, el);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          handleElementClick(e, el);
        }}
        sceneFunc={(ctx) => {
          drawBentGroupShape({
            ctx: ctx as unknown as CanvasRenderingContext2D,
            isSelected,
            el,
            b: groupEdgeBends || { top: 0, right: 0, bottom: 0, left: 0 },
          });
        }}
      />

      {el.children?.map((child) => {
        const pos = applyEdgeBendsToChild(
          child,
          el,
          groupEdgeBends || { top: 0, right: 0, bottom: 0, left: 0 },
        );
        const childX = pos.x + offsetX;
        const childY = pos.y + offsetY;
        const isChildSelected = selectedIds.includes(child.id);

        return (
          <Group
            key={child.id}
            x={childX}
            y={childY}
            ref={(node) => {
              if (node) {
                if (elementRefs?.current) {
                  elementRefs.current[child.id] = node;
                }
              } else
                elementRefs?.current && delete elementRefs.current[child.id];
            }}
            onClick={(e) => {
              e.cancelBubble = true;
              handleElementClick(e, child);
            }}
            onTap={(e) => {
              e.cancelBubble = true;
              handleElementClick(e, child);
            }}
            onDragEnd={(e) => {
              const node = e.target;
              const updated = {
                ...child,
                x: node.x(),
                y: node.y(),
              };
              setElements((prev) =>
                prev.map((item) => (item.id === child.id ? updated : item)),
              );
            }}
            onTransformEnd={(e) => handleTransformEnd(e, child)}
          >
            {child.type === "seat" ? (
              <Seat el={child} selectedIds={selectedIds} />
            ) : (
              <>
                <Rect
                  width={child.width}
                  height={child.height}
                  fill={child.fill}
                  stroke={isChildSelected ? "blue" : undefined}
                  strokeWidth={isChildSelected ? 2 : 0}
                />
                {child.text && (
                  <Text
                    text={child.text}
                    fontSize={child.fontSize || 16}
                    fill="black"
                    width={child.width}
                    height={child.height}
                    align="center"
                    verticalAlign="middle"
                  />
                )}
              </>
            )}
          </Group>
        );
      })}
      {isSelected && (
        <EdgeBendControls
          el={el}
          groupEdgeBends={
            groupEdgeBends || { top: 0, right: 0, bottom: 0, left: 0 }
          }
          setGroupEdgeBends={setGroupEdgeBends}
        />
      )}
    </Group>
  );
};
