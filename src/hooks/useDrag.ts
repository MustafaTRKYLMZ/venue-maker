import { useState } from "react";
import { Section } from "../types/venue";
export function useDrag(
  sections: Section[],
  setSections: React.Dispatch<React.SetStateAction<Section[]>>,
) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const startDrag = (
    e: React.MouseEvent,
    section: Section,
    isAltPressed: boolean,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setOffset(newOffset);

    if (isAltPressed) {
      const copy: Section = {
        ...section,
        id: crypto.randomUUID(),
        position: {
          x: section.position.x + 10,
          y: section.position.y + 10,
        },
      };
      setSections([...sections, copy]);
      setDraggingId(copy.id);
    } else {
      setDraggingId(section.id);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;

    setSections((prev) =>
      prev.map((sec) =>
        sec.id === draggingId
          ? {
              ...sec,
              position: {
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
              },
            }
          : sec,
      ),
    );
  };

  const stopDrag = () => {
    setDraggingId(null);
  };

  return {
    draggingId,
    startDrag,
    onMouseMove,
    stopDrag,
  };
}
