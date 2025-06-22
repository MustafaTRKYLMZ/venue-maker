// GroupElement.tsx
import React from "react";
import { Group, Rect, Text, Circle, Shape } from "react-konva";
import { MapElement } from "@/src/types/mapElement";
import { Seat } from "./Seat";
import { EdgeBendControls } from "./EdgeBendControls";
import { GroupEdgeBends } from "@/src/types/groupEdgeBends";
import { applyEdgeBendsToChild } from "@/src/utils/helpers";

type GroupElementProps = {
  setElements: React.Dispatch<React.SetStateAction<MapElement[]>>;
  handleElementClick: (e: any, el: MapElement) => void;
  handleTransformEnd: (e: any, el: MapElement) => void;
  selectedIds?: string[];
  groupEdgeBends?: GroupEdgeBends;
  el: MapElement;
  isSelected?: boolean;
  setGroupEdgeBends: React.Dispatch<React.SetStateAction<GroupEdgeBends>>;
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
}) => {
  return (
    <Group key={el.id} x={el.x} y={el.y} draggable>
      <Shape
        sceneFunc={(ctx) => {
          const w = el.width;
          const h = el.height;
          const b = groupEdgeBends;

          ctx.beginPath();

          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(w / 2, b.top, w, 0);
          ctx.quadraticCurveTo(w + b.right, h / 2, w, h);
          ctx.quadraticCurveTo(w / 2, h + b.bottom, 0, h);
          ctx.quadraticCurveTo(b.left, h / 2, 0, 0);

          ctx.closePath();

          ctx.fillStyle = el.fill || "transparent";
          ctx.fill();

          ctx.strokeStyle = isSelected ? "blue" : "gray";
          ctx.lineWidth = isSelected ? 2 : 1;
          ctx.stroke();
        }}
      />

      {/* Çocukları çiziyoruz, pozisyonları yay deformasyonuna göre ayarlanıyor */}
      {el.children?.map((child) => {
        const pos = applyEdgeBendsToChild(
          child,
          el,
          groupEdgeBends || { top: 0, right: 0, bottom: 0, left: 0 }
        );
        const isChildSelected = selectedIds.includes(child.id);

        return (
          <Group
            x={pos.x}
            y={pos.y}
            onClick={(e) => handleElementClick(e, child)}
            onDragEnd={(e) => {
              const node = e.target;
              const updated = {
                ...child,
                x: node.x(),
                y: node.y(),
              };
              setElements((prev) =>
                prev.map((item) => (item.id === child.id ? updated : item))
              );
            }}
            onTransformEnd={(e) => handleTransformEnd(e, child)}
          >
            {/* Örnek: seat tipi ise circle ile çiz */}
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
      <EdgeBendControls
        el={el}
        groupEdgeBends={
          groupEdgeBends || { top: 0, right: 0, bottom: 0, left: 0 }
        }
        setGroupEdgeBends={setGroupEdgeBends}
      />
    </Group>
  );
};
