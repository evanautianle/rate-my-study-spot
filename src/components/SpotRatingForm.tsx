"use client";
import { useState, useEffect } from "react";
import { RatingSelector } from "./RatingSelector";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  const [success, setSuccess] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      }
    }
    fetchSession();
  }, []);

  // Submit rating
  async function submitRating() {
    if (loading) return;
    if (!session) {
      setError("You must be logged in to submit a rating.");
      return;
    }
    setLoading(true);
    setError(null);

    // Ensure all fields are selected
    if (quietness === null || comfort === null || seatAvailability === null || outletAvailability === null || wifiConnection === null) {
      setError("Please select all rating fields.");
      setLoading(false);
      return;
    }

    // Calculate overall rating (simple average of all ratings)
    const allRatings = [quietness, comfort, seatAvailability, outletAvailability, wifiConnection];
    const overallRating = Math.round(
      allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
    );

    try {
      console.log("Submitting rating with data:", {
        rating: overallRating,
        quietness,
        comfort,
        seatAvailability,
        outletAvailability,
        wifiConnection,
      });
      
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

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);
      console.log("Response headers:", res.headers);
      
      if (!res.ok) {
        console.error("Server response error:", {
          status: res.status,
          statusText: res.statusText,
          data: data
        });
        throw new Error(data.error || data.details || "Failed to submit rating");
      }

      if (onSuccess) onSuccess();
      setSuccess(true);
      // Reset form after successful submission
      setTimeout(() => {
        setQuietness(null);
        setComfort(null);
        setSeatAvailability(null);
        setOutletAvailability(null);
        setWifiConnection(null);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error("Rating submission error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Manual submit function
  const handleSubmit = () => {
    submitRating();
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black">
      <div className="text-center text-sm text-zinc-500 mb-2">
        Rate all categories from 1 (Poor) to 5 (Excellent)
      </div>
      {!session ? (
        <div className="text-center py-4 space-y-4">
          <p className="text-zinc-500">Please log in to submit a rating.</p>
          <Button asChild>
            <Link href="/login">Login to Rate</Link>
          </Button>
        </div>
      ) : (
        <>
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
            options={[1, 2, 3, 4, 5]}
            onChange={setSeatAvailability}
            loading={loading}
          />

          <RatingSelector
            label="Outlet Availability"
            value={outletAvailability}
            options={[1, 2, 3, 4, 5]}
            onChange={setOutletAvailability}
            loading={loading}
          />

          <RatingSelector
            label="WiFi Connection"
            value={wifiConnection}
            options={[1, 2, 3, 4, 5]}
            onChange={setWifiConnection}
            loading={loading}
          />

          {success && (
            <div className="text-green-600 text-sm mt-2">
              ✓ Rating submitted successfully!
            </div>
          )}
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          
          <Button 
            onClick={handleSubmit}
            disabled={loading || !session || quietness === null || comfort === null || seatAvailability === null || outletAvailability === null || wifiConnection === null}
            className="w-full mt-4"
          >
            {loading ? "Submitting..." : "Submit Rating"}
          </Button>
        </>
      )}
    </div>
  );
}