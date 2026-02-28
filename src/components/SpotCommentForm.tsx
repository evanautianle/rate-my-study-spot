"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SpotCommentFormProps {
  spotId: string;
  onSuccess?: () => void;
}

export default function SpotCommentForm({ spotId, onSuccess }: SpotCommentFormProps) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/spots/${spotId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit comment");

      setComment("");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="font-medium text-sm text-black dark:text-white">Comment:</label>
      <Textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Write your thoughts..."
        rows={3}
        required
      />
      <Button type="submit" disabled={loading || !comment.trim()}>
        {loading ? "Submitting..." : "Submit Comment"}
      </Button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </form>
  );
}