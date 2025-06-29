"use client";

import React, { createContext, useContext, useState } from "react";
import { Venue } from "@/src/types/venue";
import { ToolType } from "@/src/types/element";

type MapEditorContextType = {
  venue: Venue;
  setVenue: React.Dispatch<React.SetStateAction<Venue>>;
  selectedTool: ToolType | null;
  setSelectedTool: React.Dispatch<React.SetStateAction<ToolType | null>>;
  selectedFloorId: string | null;
  setSelectedFloorId: React.Dispatch<React.SetStateAction<string | null>>;
};

const MapEditorContext = createContext<MapEditorContextType | undefined>(
  undefined
);

export const useMapEditor = () => {
  const context = useContext(MapEditorContext);
  if (!context) {
    throw new Error("useMapEditor must be used within a MapEditorProvider");
  }
  return context;
};

export const MapEditorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [venue, setVenue] = useState<Venue>({
    id: "venue-1",
    type: "venue",
    name: "New Venue",
    floors: [
      {
        id: "1",
        name: "Ground Floor",
        type: "floor",
        index: 0,
        sections: [],
        doors: [],
        stage: undefined,
        walls: [],
        lights: [],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    address: "Lele Street 123",
    description: "A new venue for events",
    image: "https://example.com/venue-image.jpg",
    capacity: 5000,
  });

  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(
    venue.floors.length > 0 ? venue.floors[0].id : "1"
  );
  return (
    <MapEditorContext.Provider
      value={{
        venue,
        setVenue,
        selectedTool,
        setSelectedTool,
        selectedFloorId,
        setSelectedFloorId,
      }}
    >
      {children}
    </MapEditorContext.Provider>
  );
};
