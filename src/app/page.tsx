
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SpotForm from "@/components/SpotForm";
import SpotList, { Spot } from "@/components/SpotList";

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
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-black p-8">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-zinc-50">Study Spots</h1>

      {/* Spot creation form for logged-in users */}
      {status === "loading" ? null : session ? (
        <SpotForm onCreated={fetchSpots} />
      ) : null}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <SpotList spots={spots} />
      )}
    </div>
  );
}
// 