import { MapEditorProvider } from "@/src/context/MapEditorContext";
import { MapEditorContent } from "./MapEditorContent";

export default function MapEditorPage() {
  return (
    <MapEditorProvider>
      <MapEditorContent />
    </MapEditorProvider>
  );
}
