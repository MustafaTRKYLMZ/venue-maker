"use client";

import { useEffect, useState } from "react";
import { LeftPanelTools } from "@/src/components/LeftPanelTools";
import { useAddFloor } from "@/src/hooks/useAddFloor";
import { MapEditorHeader } from "@/src/components/MapEditorHeader";
import { PropertiesPanel } from "@/src/components/PropertiesPanel";
import { CanvasEditor } from "@/src/components/canvas-editor/CanvasEditor";
import { AddMultipleSeatDialog } from "@/src/components/AddMultipleSeatDialog";
import { CanvasEditorProvider } from "@/src/components/canvas-editor/CanvasEditorContext";
import { useMapEditor } from "@/src/context/MapEditorContext";

export function MapEditorContent() {
  const {
    venue,
    setVenue,
    selectedTool,
    setSelectedTool,
    selectedFloorId,
    setSelectedFloorId,
  } = useMapEditor();

  const [rows, setRows] = useState<number>(5);
  const [cols, setCols] = useState<number>(10);
  const [isMultipleSeatDialogOpen, setIsMultipleSeatDialogOpen] =
    useState(false);
  const addFloor = useAddFloor(venue, setVenue);

  useEffect(() => {
    if (venue.floors.length > 0 && !selectedFloorId) {
      setSelectedFloorId(venue.floors[0].id);
    }
  }, [venue.floors, selectedFloorId]);

  useEffect(() => {
    if (selectedTool?.type === "floor") {
      addFloor();
      setSelectedTool(null);
    }
  }, [selectedTool]);

  const handleCloseMultipleSeatDialog = () => {
    setIsMultipleSeatDialogOpen(false);
  };

  const onConfirmAddSeats = () => {
    setSelectedTool({ type: "section", rows, cols });
  };

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
      <div className="flex flex-grow overflow-visible">
        {/* Left panel */}
        <aside className="w-40 bg-gray-100 border-r border-gray-300 overflow-auto p-1 z-10">
          <LeftPanelTools
            setIsMultipleSeatDialogOpen={setIsMultipleSeatDialogOpen}
          />
        </aside>

        {/* Canvas area */}
        <main className="relative flex-grow bg-white rounded-md border border-gray-300 overflow-auto flex flex-col">
          <CanvasEditorProvider>
            <CanvasEditor
              venue={venue}
              setVenue={setVenue}
              selectedFloorId={selectedFloorId}
              onSelectFloor={setSelectedFloorId}
              onAddFloor={addFloor}
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
              rows={rows}
              cols={cols}
            />
          </CanvasEditorProvider>
        </main>

        {/* Right panel */}
        <aside className="w-64 bg-gray-50 border-l border-gray-300 p-3">
          <PropertiesPanel
            selectedElement={null}
            onUpdateElement={() => {}}
            onDeleteElement={() => {}}
          />
        </aside>

        {/* Add Multiple Seat Dialog */}
        {isMultipleSeatDialogOpen && (
          <AddMultipleSeatDialog
            rows={rows}
            setRows={setRows}
            cols={cols}
            setCols={setCols}
            onConfirmAddSeats={onConfirmAddSeats}
            onClose={handleCloseMultipleSeatDialog}
          />
        )}
      </div>
    </div>
  );
}
