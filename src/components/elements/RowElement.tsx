import { Group, Rect } from "react-konva";
import { Row } from "@/src/types/venue";
import { SeatElement } from "./SeatElement";

interface Props {
  row: Row;
  onSeatClick: (seatId: string) => void;
}

export const RowElement = ({ row, onSeatClick }: Props) => {
  return (
    <Group x={row.position.x} y={row.position.y}>
      {row.seats.map((seat) => (
        <SeatElement key={seat.id} seat={seat} onClick={onSeatClick} />
      ))}
    </Group>
  );
};
