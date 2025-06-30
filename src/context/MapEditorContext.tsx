"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Venue } from "@/src/types/venue";
import { SelectedElement, ToolType } from "@/src/types/element";

type MapEditorContextType = {
  venue: Venue;
  setVenue: (newVenue: Venue) => void;
  selectedTool: ToolType | null;
  setSelectedTool: React.Dispatch<React.SetStateAction<ToolType | null>>;
  selectedFloorId: string | null;
  setSelectedFloorId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedElement: SelectedElement | null;
  setSelectedElement: React.Dispatch<
    React.SetStateAction<SelectedElement | null>
  >;
  history: Venue[];
  setHistory: React.Dispatch<React.SetStateAction<Venue[]>>;
  historyPointer: number;
  setHistoryPointer: React.Dispatch<React.SetStateAction<number>>;
};

const MapEditorContext = createContext<MapEditorContextType | undefined>(
  undefined,
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
  const [selectedElement, setSelectedElement] =
    useState<SelectedElement | null>(null);
  const [history, setHistory] = useState<Venue[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(
    venue.floors.length > 0 ? venue.floors[0].id : "1",
  );

  const pushToHistory = (newVenue: Venue) => {
    const updatedHistory = history.slice(0, historyPointer + 1);
    updatedHistory.push(newVenue);
    setHistory(updatedHistory);
    setHistoryPointer(updatedHistory.length - 1);
  };
  const updateVenue = (newVenue: Venue) => {
    setVenue(newVenue);
    pushToHistory(newVenue);
  };

  useEffect(() => {
    if (venue && history.length === 0) {
      setHistory([venue]);
      setHistoryPointer(0);
    }
  }, [venue]);
  return (
    <MapEditorContext.Provider
      value={{
        venue,
        setVenue: (newVenue: Venue) => updateVenue(newVenue),
        selectedTool,
        setSelectedTool,
        selectedFloorId,
        setSelectedFloorId,
        selectedElement,
        setSelectedElement,
        history,
        historyPointer,
        setHistoryPointer,
        setHistory,
      }}
    >
      {children}
    </MapEditorContext.Provider>
  );
};
