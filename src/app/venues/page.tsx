"use client";

import { useVenues } from "@/src/context/VenuesContext";
import Link from "next/link";

export default function VenueListPage() {
  const { venues } = useVenues();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Venues</h1>
      <ul className="space-y-4">
        {venues?.map((venue) => (
          <li
            key={venue.id}
            className="p-4 border rounded-md flex justify-between items-center"
          >
            <span>{venue.name}</span>
            <Link
              href={`/editor/${venue.id}`}
              className="text-blue-600 hover:underline"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
