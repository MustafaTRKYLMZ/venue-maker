"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Group,
  Transformer,
  Circle,
  Shape,
} from "react-konva";
import Konva from "konva";
import { MapElement } from "@/src/types/mapElement";
import { ElementType } from "@/src/types/element";
import { KonvaEventObject } from "konva/lib/Node";

type MapEditorCanvasProps = {
  width: number;
  height: number;
  elements: MapElement[];
  setElements: React.Dispatch<React.SetStateAction<MapElement[]>>;
  selectedIds: string[];
  onSelectElements: (elements: MapElement[]) => void;
  selectedTool: ElementType | null;
  addElementAtPosition: (
    type: ElementType,
    position: { x: number; y: number }
  ) => void;
  setSelectedTool: (tool: string | null) => void;
  addSeatsGrid: (
    position: { x: number; y: number },
    rows: number,
    cols: number,
    seatWidth: number,
    seatHeight: number,
    gap?: number
  ) => void;

  multipleSeatsGridFields?: {
    rows: number;
    cols: number;
  };
};

export const MapEditorCanvas: React.FC<MapEditorCanvasProps> = ({
  width,
  height,
  elements,
  setElements,
  selectedIds,
  onSelectElements,
  selectedTool,
  addElementAtPosition,
  setSelectedTool,
  addSeatsGrid,
  multipleSeatsGridFields = { rows: 0, cols: 0 },
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectionVisible, setSelectionVisible] = useState(false);

  const elementRefs = useRef<Record<string, Konva.Node>>({});

  // Yeni: Grup yay deformasyonları (top, right, bottom, left)
  const [groupEdgeBends, setGroupEdgeBends] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const transformer = transformerRef.current;

    if (!transformer) return;
    requestAnimationFrame(() => {
      const selectedNodes = selectedIds
        .map((id) => elementRefs.current[id])
        .filter(Boolean) as Konva.Node[];

      transformer.nodes(selectedNodes);
      transformer.getLayer()?.batchDraw();
    });
  }, [selectedIds]);

  const getElementBounds = (el: MapElement) => ({
    x1: el.x,
    y1: el.y,
    x2: el.x + el.width,
    y2: el.y + el.height,
  });

  const isInside = (a: any, b: any) =>
    a.x1 >= b.x1 && a.y1 >= b.y1 && a.x2 <= b.x2 && a.y2 <= b.y2;

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;

    const pos = stageRef.current?.getPointerPosition();
    if (pos) {
      setSelectionStart(pos);
      setSelectionVisible(true);
      selectionRectRef.current?.setAttrs({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        visible: true,
      });
    }
  };

  const handleMouseMove = () => {
    if (!selectionStart || !selectionVisible) return;

    const pos = stageRef.current?.getPointerPosition();
    if (!pos) return;

    const newX = Math.min(selectionStart.x, pos.x);
    const newY = Math.min(selectionStart.y, pos.y);
    const newWidth = Math.abs(pos.x - selectionStart.x);
    const newHeight = Math.abs(pos.y - selectionStart.y);

    selectionRectRef.current?.setAttrs({
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    });
  };

  const handleMouseUp = () => {
    if (!selectionStart || !selectionVisible) return;

    const box = selectionRectRef.current?.getClientRect();
    if (!box) return;

    const selected = elements.filter((el) =>
      isInside(getElementBounds(el), {
        x1: box.x,
        y1: box.y,
        x2: box.x + box.width,
        y2: box.y + box.height,
      })
    );

    onSelectElements(selected);
    setSelectionStart(null);
    setSelectionVisible(false);
    selectionRectRef.current?.setAttrs({ visible: false });
  };

  const handleElementClick = (e: any, el: MapElement) => {
    const isSelected = selectedIds.includes(el.id);

    if (e.evt.shiftKey) {
      const newSelection = isSelected
        ? selectedIds
            .filter((id) => id !== el.id)
            .map((id) => elements.find((e) => e.id === id)!)
        : [...selectedIds.map((id) => elements.find((e) => e.id === id)!), el];

      onSelectElements(newSelection.filter(Boolean));
    } else {
      onSelectElements([el]);
    }
  };

  const handleTransformEnd = (
    e: Konva.KonvaEventObject<Event>,
    el: MapElement
  ) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const updated = {
      ...el,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      width: el.width * scaleX,
      height: el.height * scaleY,
    };

    node.scaleX(1);
    node.scaleY(1);

    setElements((prev) =>
      prev.map((item) => (item.id === el.id ? updated : item))
    );
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) {
      return;
    }
    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    const container = stage.container();

    if (selectedTool === "multiple_seat") {
      if (
        multipleSeatsGridFields.rows > 0 &&
        multipleSeatsGridFields.cols > 0
      ) {
        addSeatsGrid(
          pointerPos,
          multipleSeatsGridFields.rows,
          multipleSeatsGridFields.cols,
          40,
          40
        );
      }
      setSelectedTool(null);
    } else if (selectedTool) {
      addElementAtPosition(selectedTool, pointerPos);
      setSelectedTool(null);
      if (container) container.style.cursor = "default";
    } else {
      onSelectElements([]);
    }
  };

  // Grup içindeki çocuk pozisyonlarını edgeBends ile biraz modifiye ediyoruz
  const applyEdgeBendsToChild = (
    child: MapElement,
    group: MapElement,
    bends: typeof groupEdgeBends
  ): { x: number; y: number } => {
    let newX = child.x;
    let newY = child.y;

    const relX = child.x;
    const relY = child.y;
    const w = group.width;
    const h = group.height;

    const topEffect = bends.top * (1 - Math.abs(relX - w / 2) / (w / 2));
    const rightEffect = bends.right * (1 - Math.abs(relY - h / 2) / (h / 2));
    const bottomEffect = bends.bottom * (1 - Math.abs(relX - w / 2) / (w / 2));
    const leftEffect = bends.left * (1 - Math.abs(relY - h / 2) / (h / 2));

    newX += rightEffect + leftEffect;
    newY += topEffect + bottomEffect;

    return { x: newX, y: newY };
  };

  // Yeni: grup için özel render fonksiyonu
  const renderGroupElement = (el: MapElement) => {
    const isSelected = selectedIds.includes(el.id);

    // Burada yay deformasyonuna göre grup şekli çiziliyor
    return (
      <Group
        key={el.id}
        x={el.x}
        y={el.y}
        // grup sabit kalacak, draggable olabilir istersen buraya draggable ekle
      >
        {/* Grup sınırlarını çiziyoruz, yay deformasyonu ile */}
        <Shape
          sceneFunc={(ctx, shape) => {
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
          const pos = applyEdgeBendsToChild(child, el, groupEdgeBends);
          const isChildSelected = selectedIds.includes(child.id);

          return (
            <Group
              key={child.id}
              x={pos.x}
              y={pos.y}
              draggable
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
                <>
                  <Circle
                    x={child.width / 2}
                    y={child.height / 2}
                    radius={child.width / 2}
                    fill={child.fill}
                    stroke={isChildSelected ? "blue" : undefined}
                    strokeWidth={isChildSelected ? 2 : 0}
                  />
                  {child.text && (
                    <Text
                      text={child.text}
                      fontSize={child.fontSize || 12}
                      fill="black"
                      align="center"
                      verticalAlign="middle"
                      width={child.width}
                      height={child.height}
                      offsetX={child.width / 2}
                      offsetY={child.height / 2}
                      x={child.width / 2}
                      y={child.height / 2}
                    />
                  )}
                </>
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

        {/* Yay deformasyonu için kenar ortası kontrol noktaları */}
        {/* Üst-orta */}
        <Circle
          key="bend-top"
          x={el.width / 2}
          y={groupEdgeBends.top}
          radius={8}
          fill="red"
          draggable
          dragBoundFunc={(pos) => {
            const minY = -el.height / 2;
            const maxY = el.height / 2;
            let y = Math.min(Math.max(pos.y, minY), maxY);
            return { x: el.width / 2, y };
          }}
          onDragMove={(e) => {
            const pos = e.target.position();
            setGroupEdgeBends((prev) => ({ ...prev, top: pos.y }));
          }}
        />

        {/* Sağ-orta */}
        <Circle
          key="bend-right"
          x={el.width + groupEdgeBends.right}
          y={el.height / 2}
          radius={8}
          fill="red"
          draggable
          dragBoundFunc={(pos) => {
            const minX = el.width / 2;
            const maxX = el.width * 1.5;
            let x = Math.min(Math.max(pos.x, minX), maxX);
            return { x, y: el.height / 2 };
          }}
          onDragMove={(e) => {
            const pos = e.target.position();
            setGroupEdgeBends((prev) => ({ ...prev, right: pos.x - el.width }));
          }}
        />

        {/* Alt-orta */}
        <Circle
          key="bend-bottom"
          x={el.width / 2}
          y={el.height + groupEdgeBends.bottom}
          radius={8}
          fill="red"
          draggable
          dragBoundFunc={(pos) => {
            const minY = el.height / 2;
            const maxY = el.height * 1.5;
            let y = Math.min(Math.max(pos.y, minY), maxY);
            return { x: el.width / 2, y };
          }}
          onDragMove={(e) => {
            const pos = e.target.position();
            setGroupEdgeBends((prev) => ({
              ...prev,
              bottom: pos.y - el.height,
            }));
          }}
        />

        {/* Sol-orta */}
        <Circle
          key="bend-left"
          x={groupEdgeBends.left}
          y={el.height / 2}
          radius={8}
          fill="red"
          draggable
          dragBoundFunc={(pos) => {
            const minX = -el.width / 2;
            const maxX = el.width / 2;
            let x = Math.min(Math.max(pos.x, minX), maxX);
            return { x, y: el.height / 2 };
          }}
          onDragMove={(e) => {
            const pos = e.target.position();
            setGroupEdgeBends((prev) => ({ ...prev, left: pos.x }));
          }}
        />
      </Group>
    );
  };

  return (
    <Stage
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleStageClick}
      ref={stageRef}
      style={{ cursor: selectedTool ? "crosshair" : "default" }}
    >
      <Layer>
        {elements.map((el) =>
          el.type === "group" ? (
            renderGroupElement(el)
          ) : (
            <Group
              key={el.id}
              x={el.x}
              y={el.y}
              draggable
              onDragEnd={(e) => {
                const node = e.target;
                const newX = node.x();
                const newY = node.y();

                // Grubun yeni pozisyonunu kaydet
                setElements((prev) =>
                  prev.map((item) =>
                    item.id === el.id ? { ...item, x: newX, y: newY } : item
                  )
                );
              }}
            >
              {el.type === "seat" ? (
                <>
                  <Circle
                    x={el.width / 2}
                    y={el.height / 2}
                    radius={el.width / 2}
                    fill={el.fill}
                    stroke={selectedIds.includes(el.id) ? "blue" : undefined}
                    strokeWidth={selectedIds.includes(el.id) ? 2 : 0}
                  />
                  {el.text && (
                    <Text
                      text={el.text}
                      fontSize={el.fontSize || 12}
                      fill="black"
                      align="center"
                      verticalAlign="middle"
                      width={el.width}
                      height={el.height}
                      offsetX={el.width / 2}
                      offsetY={el.height / 2}
                      x={el.width / 2}
                      y={el.height / 2}
                    />
                  )}
                </>
              ) : (
                <>
                  <Rect
                    width={el.width}
                    height={el.height}
                    fill={el.fill}
                    stroke={selectedIds.includes(el.id) ? "blue" : undefined}
                    strokeWidth={selectedIds.includes(el.id) ? 2 : 0}
                  />
                  {el.text && (
                    <Text
                      text={el.text}
                      fontSize={el.fontSize || 16}
                      fill="black"
                      width={el.width}
                      height={el.height}
                      align="center"
                      verticalAlign="middle"
                    />
                  )}
                </>
              )}
            </Group>
          )
        )}

        {/* Seçim kutusu */}
        <Rect
          ref={selectionRectRef}
          fill="rgba(0, 161, 255, 0.3)"
          visible={false}
        />

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
            // Min width/height sınırı
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
};
