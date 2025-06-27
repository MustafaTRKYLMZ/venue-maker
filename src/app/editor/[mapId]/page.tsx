"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LeftPanelTools } from "@/src/components/LeftPanelTools";
import { Venue } from "@/src/types/venue";
import { ToolType } from "@/src/types/element";
import { useAddSection } from "@/src/hooks/useAddSection";
import { useAddFloor } from "@/src/hooks/useAddFloor";
import { FloorSelector } from "@/src/components/FloorSelector";
import { MapEditorHeader } from "@/src/components/MapEditorHeader";
import { PropertiesPanel } from "@/src/components/PropertiesPanel";
import { Stage, Layer } from "react-konva";
import { CanvasEditor } from "@/src/components/canvas-editor/CanvasEditor";

const DynamicMapEditorCanvas = dynamic(
  () =>
    import("@/src/components/MapEditor/MapEditorCanvas").then(
      (mod) => mod.MapEditorCanvas,
    ),
  { ssr: false, loading: () => <p>Canvas loading...</p> },
);

export default function MapEditorPage() {
  const [venue, setVenue] = useState<Venue>({
    id: "venue-1",
    type: "venue",
    name: "New Venue",
    floors: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    address: "Lele Street 123",
    description: "A new venue for events",
    image: "https://example.com/venue-image.jpg",
    capacity: 5000,
  });

  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);

  // İlk kat varsa onu seç
  useEffect(() => {
    if (venue.floors.length > 0 && !selectedFloorId) {
      setSelectedFloorId(venue.floors[0].id);
    }
  }, [venue.floors, selectedFloorId]);

  const addSection = useAddSection(venue, setVenue, selectedFloorId ?? "");
  const addFloor = useAddFloor(venue, setVenue);

  useEffect(() => {
    if (selectedTool?.type === "floor") {
      addFloor();
      setSelectedTool(null);
    }
  }, [selectedTool, addFloor]);

  useEffect(() => {
    if (selectedTool?.type === "section" && selectedFloorId) {
      addSection(selectedTool.rows, selectedTool.cols);
      setSelectedTool(null);
    }
  }, [selectedTool, addSection, selectedFloorId]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <MapEditorHeader
        venueName={venue.name}
        handleUndo={() => {}}
        handleRedo={() => {}}
        historyLength={0}
        handleSaveMap={() => {}}
        isSaving={false}
      />

      {/* Main content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Left panel */}
        <aside className="w-40  bg-gray-100 border-r border-gray-300 overflow-auto  p-2">
          <LeftPanelTools
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
          />
        </aside>

        {/* Canvas area */}
        <main className="relative flex-grow bg-white rounded-md border border-gray-300 overflow-hidden flex flex-col">
          <CanvasEditor venue={venue} setVenue={setVenue} />

          <div className="absolute left-4 bottom-4 z-10">
            <FloorSelector
              floors={venue.floors}
              selectedFloorId={selectedFloorId}
              onSelectFloor={setSelectedFloorId}
              onAddFloor={() => addFloor()}
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
            />
          </div>
        </main>

        {/* Right panel - placeholder */}
        <aside className="w-64 bg-gray-50 border-l border-gray-300 p-3">
          <PropertiesPanel
            selectedElement={null}
            onUpdateElement={() => {}}
            onDeleteElement={() => {}}
          />
        </aside>
      </div>
    </div>
  );
}
