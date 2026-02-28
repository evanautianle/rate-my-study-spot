"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SpotRatingForm from "@/components/SpotRatingForm";
import SpotCommentForm from "@/components/SpotCommentForm";

import { use } from "react";

export default function SpotDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {

  const awaitedParams = typeof (params as any).then === "function" ? use(params as Promise<{ id: string }>) : params as { id: string };
  const [spot, setSpot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function fetchSpot() {
      setLoading(true);
      const res = await fetch(`/api/spots/${awaitedParams.id}`);
      const data = await res.json();
      setSpot(data);
      setLoading(false);
    }
    fetchSpot();
  }, [awaitedParams.id]);

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

  async function handleDeleteComment(commentId: string) {
    setDeletingCommentId(commentId);
    try {
      const res = await fetch(`/api/spots/${awaitedParams.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      if (!res.ok) {
        // Optionally handle error
      }
      const refreshed = await fetch(`/api/spots/${awaitedParams.id}`);
      const data = await refreshed.json();
      setSpot(data);
    } finally {
      setDeletingCommentId(null);
    }
  }

  if (loading) return <div className="w-full max-w-2xl mx-auto mt-8">Loading...</div>;
  if (!spot || spot.error) return <div className="w-full max-w-2xl mx-auto mt-8">Spot not found.</div>;

  // Calculate averages per section (simple average for all fields)
  const sectionKeys = ["quietness", "comfort", "seatAvailability", "outletAvailability", "wifiConnection"];
  const sectionAverages: Record<string, string> = {};
  sectionKeys.forEach((key) => {
    const vals = spot.ratings.map((r: any) => r[key]).filter((v: any) => v !== null && v !== undefined);
    sectionAverages[key] = vals.length ? (vals.reduce((a: number, b: number) => a + b, 0) / vals.length).toFixed(1) : "N/A";
  });

  // Overall average
  const overallAvg = spot.ratings.length
    ? (spot.ratings.reduce((sum: number, r: any) => sum + (r.overallRating ?? 0), 0) / spot.ratings.length).toFixed(1)
    : "N/A";

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">{spot.name}</h1>
          <p className="text-zinc-600 dark:text-zinc-300">Building: {spot.building}</p>

          {/* Overall average */}
          <div className="text-3xl font-bold text-center my-2">
            {overallAvg !== "N/A" ? overallAvg : "No ratings yet"}
          </div>

          {/* Section averages */}
          <div className="grid grid-cols-2 gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            {sectionKeys.map((key) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span>{sectionAverages[key]}</span>
              </div>
            ))}
          </div>

          <SpotRatingForm spotId={spot._id?.toString()} onSuccess={() => window.location.reload()} />
          <SpotCommentForm spotId={spot._id?.toString()} onSuccess={() => window.location.reload()} />

          {/* Comments */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Comments</h2>
            {spot.comments.length === 0 ? (
              <p className="text-zinc-400">No comments yet.</p>
            ) : (
              <ul className="space-y-2">
                {spot.comments.map((c: any, idx: number) => {
                  const isOwnComment = session?.user && c.userId && c.userId.email === session.user.email;
                  return (
                    <li key={c._id || idx} className="border rounded p-2 flex justify-between items-center">
                      <div>
                        <div className="text-sm">{c.text}</div>
                        {c.userId && c.userId.name && <div className="text-xs text-zinc-500">by {c.userId.name}</div>}
                        {c.createdAt && <div className="text-xs text-zinc-400">{new Date(c.createdAt).toLocaleString()}</div>}
                      </div>
                      {isOwnComment && (
                        <button
                          className="ml-4 px-2 py-1 text-xs bg-black text-white rounded hover:bg-zinc-800 disabled:opacity-50"
                          disabled={deletingCommentId === c._id?.toString()}
                          onClick={() => handleDeleteComment(c._id?.toString())}
                        >
                          {deletingCommentId === c._id?.toString() ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}