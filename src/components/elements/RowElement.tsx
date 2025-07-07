import { Group, Rect } from "react-konva";
import { Row } from "@/src/types/venue";
import { SeatElement } from "./SeatElement";
import { KonvaEventObject } from "konva/lib/Node";

interface Props {
  row: Row;
  onSeatClick: (seatId: string, e: KonvaEventObject<MouseEvent>) => void;
}

export const RowElement = ({ row, onSeatClick }: Props) => {
  return (
    <Group x={row.position.x} y={row.position.y} rotation={row.rotation}>
      {row.seats.map((seat) => (
        <SeatElement key={seat.id} seat={seat} onClick={onSeatClick} />
      ))}
    </Group>
  );
};
