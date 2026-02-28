"use client";
import { useState, useEffect } from "react";
import { RatingSelector } from "./RatingSelector";

interface SpotRatingFormProps {
  spotId: string;
  onSuccess?: () => void;
}

export default function SpotRatingForm({ spotId, onSuccess }: SpotRatingFormProps) {
  const [quietness, setQuietness] = useState<number | null>(null);
  const [comfort, setComfort] = useState<number | null>(null);
  const [seatAvailability, setSeatAvailability] = useState<number | null>(null);
  const [outletAvailability, setOutletAvailability] = useState<number | null>(null);
  const [wifiConnection, setWifiConnection] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit rating
async function submitRating() {
  if (loading) return;
  setLoading(true);
  setError(null);

  // Map each rating to a 1-5 scale
  const normalizedRatings = [
    quietness,  // 1-5 already
    comfort,    // 1-5 already
    seatAvailability && seatAvailability > 0 ? (seatAvailability / 4) * 5 : null, // 1-4 → 1-5
    outletAvailability && outletAvailability > 0 ? (outletAvailability / 4) * 5 : null, // 1-4 → 1-5
    wifiConnection && wifiConnection > 0 ? (wifiConnection / 4) * 5 : null, // 1-4 → 1-5
  ];

  // Make sure all fields are selected
  if (normalizedRatings.some((v) => v === null)) {
    setError("Please select all rating fields.");
    setLoading(false);
    return;
  }

  // Average and round to nearest integer
  const overallRating = Math.round(
    normalizedRatings.reduce((a, b) => a + (b ?? 0), 0) / normalizedRatings.length
  );

  try {
    const res = await fetch(`/api/spots/${spotId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: overallRating,
        quietness,
        comfort,
        seatAvailability,
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
      quietness !== null &&
      comfort !== null &&
      seatAvailability !== null &&
      outletAvailability !== null &&
      wifiConnection !== null
    ) {
      submitRating();
    }
  }, [quietness, comfort, seatAvailability, outletAvailability, wifiConnection]);

  return (
    <div className="flex flex-col gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black">
      <RatingSelector
        label="Quietness"
        value={quietness}
        options={[1, 2, 3, 4, 5]}
        onChange={setQuietness}
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
        label="Seat Availability"
        value={seatAvailability}
        options={[
          { label: "N/A", value: 0 },
          { label: "Poor", value: 1 },
          { label: "Mediocre", value: 2 },
          { label: "Good", value: 3 },
          { label: "Excellent", value: 4 },
        ]}
        onChange={setSeatAvailability}
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