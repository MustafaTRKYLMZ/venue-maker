"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Venue } from "@/src/types/venue";
import { toast } from "sonner";

type VenuesContextType = {
  venues: Venue[];
  addVenue: (venue: Venue) => void;
  updateVenue: (updated: Venue) => void;
  deleteVenue: (venueId: string) => void;
};

const VenuesContext = createContext<VenuesContextType | undefined>(undefined);

export const useVenues = () => {
  const ctx = useContext(VenuesContext);
  if (!ctx) throw new Error("useVenues must be used inside a VenuesProvider");
  return ctx;
};

export const VenuesProvider = ({ children }: { children: React.ReactNode }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("venues");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setVenues(parsed);
      } catch (e) {
        toast.error("Failed to parse venues from localStorage");
        console.error("Invalid JSON in localStorage:", e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("venues", JSON.stringify(venues));
    }
  }, [venues, isInitialized]);

  const addVenue = (venue: Venue) => setVenues((prev) => [...prev, venue]);

  const updateVenue = (updated: Venue) =>
    setVenues((prev) =>
      prev.map((v) =>
        v.id === updated.id ? { ...updated, _updatedAt: Date.now() } : v,
      ),
    );

  const deleteVenue = (venueId: string) =>
    setVenues((prev) => prev.filter((v) => v.id !== venueId));

  return (
    <VenuesContext.Provider
      value={{ venues, addVenue, updateVenue, deleteVenue }}
    >
      {children}
    </VenuesContext.Provider>
  );
};
