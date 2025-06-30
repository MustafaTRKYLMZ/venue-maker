import { Circle } from "react-konva";
import { Seat } from "@/src/types/venue";
import { KonvaEventObject } from "konva/lib/Node";

interface Props {
  seat: Seat;
  onClick: (id: string) => void;
}

export const SeatElement = ({ seat, onClick }: Props) => {
  const color =
    seat.seatType === "vip"
      ? "#facc15"
      : seat.seatType === "accessible"
        ? "#60a5fa"
        : "#94a3b8";

  return (
    <Circle
      key={seat.id}
      x={seat.position.x + seat.width / 2}
      y={seat.position.y + seat.height / 2}
      radius={seat.width / 2}
      fill={color}
      stroke={seat.isSelected ? "#ef4444" : "#1e293b"}
      strokeWidth={seat.isSelected ? 3 : 1}
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
