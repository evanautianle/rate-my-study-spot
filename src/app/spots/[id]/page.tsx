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
    // Fetch current session for user id
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
      // Refresh spot data
      const refreshed = await fetch(`/api/spots/${awaitedParams.id}`);
      const data = await refreshed.json();
      setSpot(data);
    } finally {
      setDeletingCommentId(null);
    }
  }

  if (loading) return <div className="w-full max-w-2xl mx-auto mt-8">Loading...</div>;
  if (!spot || spot.error) return <div className="w-full max-w-2xl mx-auto mt-8">Spot not found.</div>;

  const avgRating = spot.ratings.length
    ? (spot.ratings.reduce((sum: number, r: any) => sum + (r.value ?? 0), 0) / spot.ratings.length).toFixed(1)
    : "N/A";

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">{spot.name}</h1>
          <p className="text-zinc-600 dark:text-zinc-300 mb-2">Building: {spot.building}</p>
          <p className="text-zinc-500 text-sm mb-4">Average Rating: {avgRating}</p>
          <SpotRatingForm spotId={spot._id?.toString()} onSuccess={() => window.location.reload()} />
          <SpotCommentForm spotId={spot._id?.toString()} onSuccess={() => window.location.reload()} />
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
