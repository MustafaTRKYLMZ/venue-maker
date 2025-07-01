import { Circle } from "react-konva";
import { Seat } from "@/src/types/venue";
import { KonvaEventObject } from "konva/lib/Node";
import { useMapEditor } from "@/src/context/MapEditorContext";

interface Props {
  seat: Seat;
  onClick: (id: string) => void;
}

export const SeatElement = ({ seat, onClick }: Props) => {
  const { selectedElement } = useMapEditor();
  const color =
    seat.seatType === "vip"
      ? "#facc15"
      : seat.seatType === "accessible"
        ? "#60a5fa"
        : seat.fill;

  const isSelected = selectedElement?.id === seat.id;

  return (
    <Circle
      key={seat.id}
      x={seat.position.x + seat.width / 2}
      y={seat.position.y + seat.height / 2}
      radius={seat.width / 2}
      width={isSelected ? 30 : seat.width}
      fill={color}
      stroke={isSelected ? "#ef4444" : "#1e293b"}
      strokeWidth={isSelected ? 2 : 1}
      onClick={(e: KonvaEventObject<MouseEvent>) => {
        e.cancelBubble = true;
        onClick(seat.id);
      }}
      onMouseEnter={(e) => {
        e.target.getStage()?.container().style.setProperty("cursor", "pointer");
      }}
      onMouseLeave={(e) => {
        e.target.getStage()?.container().style.setProperty("cursor", "default");
      }}
    />
  );
};
