import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Welcome to the Seat Map Builder!
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Create a New Map
        </h2>
        <p className="text-gray-600 mb-6">
          Start designing your seat layout on a blank canvas.
        </p>
        <Link
          href="/editor/new"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-300"
        >
          Create New Map
        </Link>
      </div>

      {/* Placeholder for existing maps list */}
      <div className="mt-8 text-gray-600">
        <p>Your saved maps will be listed here.</p>
      </div>
    </div>
  );
}
