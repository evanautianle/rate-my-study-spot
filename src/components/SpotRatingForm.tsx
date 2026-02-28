"use client";
import { useState, useEffect } from "react";
import { RatingSelector } from "./RatingSelector";

interface SpotRatingFormProps {
  spotId: string;
  onSuccess?: () => void;
}

export default function SpotRatingForm({ spotId, onSuccess }: SpotRatingFormProps) {
  const [noise, setNoise] = useState<number | null>(null);
  const [comfort, setComfort] = useState<number | null>(null);
  const [outletAvailability, setOutletAvailability] = useState<number | null>(null);
  const [wifiConnection, setWifiConnection] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit the rating
  async function submitRating() {
    if (loading) return; // prevent double submissions
    setLoading(true);
    setError(null);

    const outletVal = outletAvailability === 0 ? 3 : outletAvailability;
    const wifiVal = wifiConnection === 0 ? 3 : wifiConnection;

    const values = [noise, comfort, outletVal, wifiVal];
    if (values.some(v => v === null)) {
      setError("Please select all rating fields.");
      setLoading(false);
      return;
    }

    const overallRating = Math.round(values.reduce((a, b) => a + (b ?? 0), 0) / values.length);

    try {
      const res = await fetch(`/api/spots/${spotId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: overallRating,
          noise,
          comfort,
          outletAvailability,
          wifiConnection,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit rating");


      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Auto-submit when all fields are selected
  useEffect(() => {
    if (
      noise !== null &&
      comfort !== null &&
      outletAvailability !== null &&
      wifiConnection !== null
    ) {
      submitRating();
    }
  }, [noise, comfort, outletAvailability, wifiConnection]);

  return (
    <div className="flex flex-col gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black">
      <RatingSelector
        label="Noise"
        value={noise}
        options={[1, 2, 3, 4, 5]}
        onChange={setNoise}
        loading={loading}
      />

      <RatingSelector
        label="Comfort"
        value={comfort}
        options={[1, 2, 3, 4, 5]}
        onChange={setComfort}
        loading={loading}
      />

      <RatingSelector
        label="Outlet Availability"
        value={outletAvailability}
        options={[
          { label: "N/A", value: 0 },
          { label: "Poor", value: 1 },
          { label: "Mediocre", value: 2 },
          { label: "Good", value: 3 },
          { label: "Excellent", value: 4 },
        ]}
        onChange={setOutletAvailability}
        loading={loading}
      />

      <RatingSelector
        label="WiFi Connection"
        value={wifiConnection}
        options={[
          { label: "N/A", value: 0 },
          { label: "Poor", value: 1 },
          { label: "Mediocre", value: 2 },
          { label: "Good", value: 3 },
          { label: "Excellent", value: 4 },
        ]}
        onChange={setWifiConnection}
        loading={loading}
      />

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
}