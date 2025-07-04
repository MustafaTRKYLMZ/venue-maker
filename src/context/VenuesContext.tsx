"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Venue } from "@/src/types/venue";

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

  useEffect(() => {
    const stored = localStorage.getItem("venues");
    if (stored) setVenues(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("venues", JSON.stringify(venues));
  }, [venues]);

  const addVenue = (venue: Venue) => setVenues((prev) => [...prev, venue]);

  const updateVenue = (updated: Venue) =>
    setVenues((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));

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
