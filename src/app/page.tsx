
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Spot = {
  _id: string;
  name: string;
  building: string;
  ratings: any[];
  comments: any[];
};

export default function Home() {
  const { data: session, status } = useSession();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Spot creation form state
  const [name, setName] = useState("");
  const [building, setBuilding] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  // Fetch spots
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

  useEffect(() => {
    fetchSpots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle spot creation
  const handleCreateSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    setCreateSuccess("");
    try {
      const res = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, building }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create spot");
        setCreating(false);
        return;
      }
      setCreateSuccess("Spot created!");
      setName("");
      setBuilding("");
      fetchSpots();
    } catch (err: any) {
      setCreateError(err.message || "Error creating spot");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-black p-8">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-zinc-50">Study Spots</h1>

      {/* Spot creation form for logged-in users */}
      {status === "loading" ? null : session ? (
        <form
          onSubmit={handleCreateSpot}
          className="mb-8 w-full max-w-md bg-white dark:bg-zinc-900 p-6 rounded-lg shadow flex flex-col gap-4"
        >
          <h2 className="text-xl font-semibold mb-2">Add a Study Spot</h2>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Building"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            required
          />
          {createError && <p className="text-red-500 text-sm">{createError}</p>}
          {createSuccess && <p className="text-green-600 text-sm">{createSuccess}</p>}
          <Button type="submit" className="w-full" disabled={creating}>
            {creating ? "Creating..." : "Create Spot"}
          </Button>
        </form>
      ) : null}

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
