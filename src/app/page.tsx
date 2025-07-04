import Link from "next/link";
import { MapEditorHeader } from "../components/MapEditorHeader";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Welcome to the Seat Map Builder!
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Create a New Map
          </h2>
          <p className="text-gray-600 mb-4">
            Start designing your seat layout on a blank canvas.
          </p>
          <Link
            href="/editor/new"
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-300"
          >
            Create New Map
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            View Existing Maps
          </h2>
          <p className="text-gray-600 mb-4">
            Browse and edit your saved venues.
          </p>
          <Link
            href="/venues"
            className="inline-block w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 transition duration-300"
          >
            Go to Venue List
          </Link>
        </div>
      </div>
    </div>
  );
}
