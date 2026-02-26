
"use client";
import { useEffect, useState } from "react";

type Spot = {
  _id: string;
  name: string;
  building: string;
  ratings: any[];
  comments: any[];
};

export default function Home() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSpots = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/spots");
        if (!res.ok) throw new Error("Failed to fetch spots");
        const data = await res.json();
        setSpots(data);
      } catch (err: any) {
        setError(err.message || "Error fetching spots");
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-black p-8">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-zinc-50">Study Spots</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : spots.length === 0 ? (
        <p>No study spots found.</p>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          {spots.map((spot) => (
            <div key={spot._id} className="border rounded-lg p-4 bg-white dark:bg-zinc-900 shadow">
              <h2 className="text-xl font-semibold">{spot.name}</h2>
              <p className="text-zinc-600 dark:text-zinc-300">Building: {spot.building}</p>
              <p className="text-zinc-500 text-sm mt-2">Ratings: {spot.ratings.length} | Comments: {spot.comments.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
