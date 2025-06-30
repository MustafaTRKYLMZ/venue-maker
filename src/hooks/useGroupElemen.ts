import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { BaseElement } from "../types/baseElement";
import { Venue, Row, Section, Floor, Seat } from "../types/venue";

interface UseGroupElementsParams {
  selectedElements: BaseElement[];
  venue: Venue;
  setVenue: React.Dispatch<React.SetStateAction<Venue>>;
  setSelectedElements: React.Dispatch<React.SetStateAction<BaseElement[]>>;
}

export function useGroupElements({
  selectedElements,
  venue,
  setVenue,
  setSelectedElements,
}: UseGroupElementsParams) {
  const handleGroupElements = useCallback(() => {
    if (selectedElements.length < 2) {
      alert("Select at least two elements to group.");
      return;
    }

    // Tüm seçilen elementler aynı floor'da mı kontrol et
    const floorIds = new Set(selectedElements.map((el) => el.position.floorId));
    if (floorIds.size !== 1) {
      alert("All selected elements must be on the same floor.");
      return;
    }
    const floorId = Array.from(floorIds)[0];

    // Seçilen elementlerin ortak bounding box'ını hesapla
    let minX = Infinity,
      minY = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity;
    selectedElements.forEach((el) => {
      minX = Math.min(minX, el.position.x);
      minY = Math.min(minY, el.position.y);
      maxX = Math.max(maxX, el.position.x + el.width);
      maxY = Math.max(maxY, el.position.y + el.height);
    });

    // Yeni grup objesi, children yok
    const groupId = `group-${uuidv4().substring(0, 4)}`;
    const newGroup: BaseElement & { type: "group" } = {
      id: groupId,
      type: "group",
      position: { x: minX, y: minY },
      width: maxX - minX,
      height: maxY - minY,
      draggable: true,
      fill: "rgba(0, 0, 255, 0.2)", // Grup için yarı saydam mavi
      text: `Group ${groupId}`,
      fontSize: 14,
      label: `Group ${groupId}`,
    };

    setVenue((prevVenue) => {
      const updatedFloors = prevVenue.floors.map((floor) => {
        if (floor.id !== floorId) return floor;

        // Seçilen elemanları floor'dan kaldır
        const filteredDoors = floor.doors.filter(
          (door) => !selectedElements.some((sel) => sel.id === door.id),
        );

        const filteredSections = floor.sections
          .map((section) => {
            const filteredRows = section.rows
              .map((row) => {
                // Eğer row seçilmişse komple sil
                if (selectedElements.some((sel) => sel.id === row.id))
                  return null;
                // Seats içinden seçilenleri çıkar
                const filteredSeats = row.seats.filter(
                  (seat) => !selectedElements.some((sel) => sel.id === seat.id),
                );
                return { ...row, seats: filteredSeats };
              })
              .filter(Boolean) as Row[];

            // Section seçilmişse komple sil
            if (selectedElements.some((sel) => sel.id === section.id))
              return null;

            return { ...section, rows: filteredRows };
          })
          .filter(Boolean) as Section[];

        // Stage seçilmiş mi kontrol et
        const isStageSelected = selectedElements.some(
          (sel) => sel.id === floor.stage.id,
        );

        // Şimdi yeni grubu uygun yere ekle
        let updatedStage = floor.stage;
        let updatedDoors = filteredDoors;
        let updatedSections = filteredSections;

        if (isStageSelected) {
          // Stage seçilmiş, yeni grup stage olarak ata
          updatedStage = newGroup as any;
        } else if (
          selectedElements.every((sel) =>
            floor.doors.some((door) => door.id === sel.id),
          )
        ) {
          // Kapılar seçilmiş, yeni grup kapılar arrayine ekle
          updatedDoors = [...updatedDoors, newGroup as any];
        } else {
          // Section / Row seviyesinde grup
          if (updatedSections.length > 0) {
            // Var olan ilk section'ın ilk rows'una grup objesini seat gibi ekle
            const firstSection = updatedSections[0];
            if (firstSection.rows.length > 0) {
              firstSection.rows[0].seats.push(newGroup as any);
            } else {
              // Section'da row yoksa yeni row oluştur
              firstSection.rows.push({
                id: `row-${uuidv4().substring(0, 4)}`,
                type: "row",
                position: { x: minX, y: minY },
                width: maxX - minX,
                height: maxY - minY,
                draggable: true,
                seats: [
                  {
                    id: newGroup.id,
                    type: "seat",
                    seatType: SeatType,
                    position: newGroup.position,
                    width: newGroup.width,
                    height: newGroup.height,
                    draggable: newGroup.draggable,
                    fill: newGroup.fill,
                    label: newGroup.label,
                    fontSize: newGroup.fontSize,
                  },
                ],
              });
            }
          } else {
            // Section yoksa yeni section ve row oluştur
            updatedSections.push({
              id: `section-${uuidv4().substring(0, 4)}`,
              type: "section",
              position: { x: minX, y: minY },
              width: maxX - minX,
              height: maxY - minY,
              draggable: true,
              rows: [
                {
                  id: `row-${uuidv4().substring(0, 4)}`,
                  type: "row",
                  position: { x: minX, y: minY },
                  width: maxX - minX,
                  height: maxY - minY,
                  draggable: true,
                  seats: [newGroup as Seat[]],
                },
              ],
            });
          }
        }

        return {
          ...floor,
          stage: updatedStage,
          doors: updatedDoors,
          sections: updatedSections,
        };
      });

      return {
        ...prevVenue,
        floors: updatedFloors,
      };
    });

    setSelectedElements([newGroup]);
    console.log("Elements grouped:", newGroup.id);
  }, [selectedElements, setVenue, setSelectedElements]);

  return { handleGroupElements };
}
