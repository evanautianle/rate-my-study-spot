
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SpotForm from "@/components/SpotForm";
import SpotList, { Spot } from "@/components/SpotList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Removed duplicate Spot type definition

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
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-background to-zinc-100 dark:to-zinc-900 p-8">
      <Card className="w-full max-w-3xl mx-auto rounded-2xl shadow-lg border bg-white dark:bg-zinc-950">
        <CardHeader className="pb-0">
          <CardTitle className="text-3xl font-bold text-center">Study Spots</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 space-y-8">
          {/* SpotForm removed from homepage. Use Add Spot page instead. */}

          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <SpotList spots={spots} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
// 