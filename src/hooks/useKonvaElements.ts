// Örneğin: src/utils/konvaHandlers.ts
import Konva from "konva";
import { Section, Venue, Row, Seat } from "@/src/types/venue";
import { BaseElement } from "../types/baseElement";

export const handleTransformEnd = (
  e: Konva.KonvaEventObject<MouseEvent | TouchEvent>,
  elToUpdate: BaseElement,
  setElements: (updater: (prev: Venue[]) => Venue[]) => void,
) => {
  const node = e.target;
  const scaleX = node.scaleX();
  const scaleY = node.scaleY();

  node.scaleX(1);
  node.scaleY(1);

  const updatedElement = {
    ...elToUpdate,
    x: node.x(),
    y: node.y(),
    rotation: node.rotation(),
    width: (elToUpdate.width ?? 0) * scaleX,
    height: (elToUpdate.height ?? 0) * scaleY,
  };

  setElements((prevVenues) => {
    // Burada Venue dizisi içinde güncellenecek elemanı bulup değiştirmemiz gerekiyor.
    // Bu, `BaseElement` tipindeki elemanın (Section, Row vb.) Venue objesi içinde nerede bulunduğuna bağlıdır.
    // Varsayım: 'prevVenues' içindeki her bir 'Venue' objesi aslında bir 'Section' veya genel bir 'BaseElement' olabilir
    // ve biz o 'Venue' objesinin 'id'si ile eşleşen 'elToUpdate'i güncelliyoruz.
    // Ancak, sizin `setElements` tanımınız `Venue[]` bekliyor ve `Venue` objesi doğrudan `BaseElement` değil,
    // içinde `sections`, `rows` gibi diziler barındıran bir üst yapı olabilir.
    // Bu kısım, `Venue` ve `BaseElement` arasındaki tam ilişkiye göre değişir.

    // En genel ve sağlam yaklaşım, tüm Venue objelerini (yani 'sections'ları veya 'elements'ları) tarayıp
    // güncellenecek elemanı (elToUpdate.id) bulmaktır.

    return prevVenues.map((venueItem) => {
      if (venueItem.id === updatedElement.id) {
        return {
          ...updatedElement,
          name: venueItem.name,
          floors: venueItem.floors,
          createdAt: venueItem.createdAt,
          updatedAt: venueItem.updatedAt,
        } as Venue;
      }

      // Eğer Venue içinde 'sections' veya 'elements' varsa, içlerini ara
      if (
        venueItem.type === "section" &&
        (venueItem as unknown as Section).rows
      ) {
        return {
          ...venueItem,
          rows: (venueItem as unknown as Section).rows?.map((row) =>
            row.id === updatedElement.id
              ? ({ ...updatedElement, seats: row.seats } as Row)
              : row,
          ),
          // Diğer iç elementleri de kontrol etmeniz gerekebilir (örn: seats)
        } as Venue;
      }
      // Farklı tiplerde BaseElement'lar Venue içinde nerede saklandığına göre burayı genişletin.
      // Basit bir örnek olarak, sadece üst düzey BaseElement'ları güncelliyoruz:
      if (venueItem.id === updatedElement.id) {
        return updatedElement as Venue;
      }

      // Eğer `setElements` sadece üst düzey `BaseElement[]` listesini yönetiyorsa ve `Venue[]` yerine
      // `BaseElement[]` bekliyorsa, bu kısım basitleşir:
      // prevElements.map(item => item.id === updatedElement.id ? updatedElement : item)
      // Ancak mevcut `setElements` tanımınız `Venue[]` bekliyor.
      // Bu nedenle, `updatedElement`'in `Venue` array'i içindeki yerini bulup güncellemek gerekiyor.
      // Bu örnekte, 'venueItem' içinde 'sections' veya 'rows' gibi alt elemanları arayarak ilerliyorum.

      const findAndUpdate = (
        collection: any[],
        targetId: string,
        updated: BaseElement,
      ): any[] => {
        return collection.map((item) => {
          if (item.id === targetId) {
            return updated;
          }
          if (item.rows) {
            // Eğer içinde satırlar varsa (Section gibi)
            return {
              ...item,
              rows: findAndUpdate(item.rows, targetId, updated),
            };
          }
          // Diğer alt koleksiyonları da burada kontrol edin (örn: item.seats)
          return item;
        });
      };

      // Bu kısım, Venue tipinizin yapısına göre en doğru şekilde yazılmalıdır.
      // Eğer `prevVenues` aslında `Section`'lardan oluşan bir dizi ise ve `elToUpdate` doğrudan o Section veya içindeki bir Row ise:
      if (venueItem.id === updatedElement.id) {
        return updatedElement as Venue; // Eğer güncellenen doğrudan Venue listesindeki bir üst seviye elemansa
      } else if ("rows" in venueItem && venueItem.rows) {
        // Eğer Venue, Section gibi alt öğeleri olan bir yapıysa
        const updatedRows = venueItem.rows.map((row: Row) => {
          if (row.id === updatedElement.id) {
            return updatedElement as Row;
          }
          if (row.seats) {
            const updatedSeats = row.seats.map((seat: Seat) =>
              seat.id === updatedElement.id ? (updatedElement as Seat) : seat,
            );
            return { ...row, seats: updatedSeats };
          }
          return row;
        });
        return { ...venueItem, rows: updatedRows };
      }

      return venueItem;
    });
  });
};
