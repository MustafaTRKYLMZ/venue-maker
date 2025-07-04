"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Venue } from "@/src/types/venue";
import { SelectedElement, ToolType } from "@/src/types/element";
import { updateElementById as updateElementHelper } from "@/src/utils/helpers/updateElementById";
import { deleteElementById as deleteElementHelper } from "@/src/utils/helpers/deleteElementById";
import { toast } from "sonner";
import { useVenues } from "@/src/context/VenuesContext";

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
  onSave: () => Promise<void>;
  updateElementById: (updatedElement: SelectedElement) => void;
  deleteElementById: (elementId: string) => void;
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
  const { venues, addVenue, updateVenue: updateVenueInList } = useVenues();

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
    updateVenueInList(newVenue);
  };

  useEffect(() => {
    const venueFromLocal = localStorage.getItem("venue");
    if (venueFromLocal) {
      const parsedVenue = JSON.parse(venueFromLocal) as Venue;
      setVenue(parsedVenue);
    }
  }, []);

  useEffect(() => {
    if (venue && history.length === 0) {
      setHistory([venue]);
      setHistoryPointer(0);
    }
  }, [venue]);

  const onSave = async () => {
    try {
      const exists = venues.some((v) => v.id === venue.id);
      if (exists) {
        updateVenueInList(venue);
        toast.success("Venue updated successfully");
      } else {
        addVenue(venue);
        toast.success("Venue added successfully");
      }
      toast.success("Venue saved successfully");
    } catch (error) {
      console.error("Error saving venue:", error);
      toast.error("Error saving venue");
    }
  };

  const updateElementById = (updatedElement: SelectedElement) => {
    const updatedVenue = updateElementHelper(venue, updatedElement);
    updateVenue(updatedVenue);
  };

  const deleteElementById = (elementId: string) => {
    const updatedVenue = deleteElementHelper(venue, elementId);
    updateVenue(updatedVenue);
  };

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
        onSave,
        updateElementById,
        deleteElementById,
      }}
    >
      {children}
    </MapEditorContext.Provider>
  );
};
