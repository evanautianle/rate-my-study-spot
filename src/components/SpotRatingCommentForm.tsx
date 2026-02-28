import { useState } from "react";

interface SpotRatingCommentFormProps {
  spotId: string;
  onSuccess?: () => void;
}

export default function SpotRatingCommentForm({ spotId, onSuccess }: SpotRatingCommentFormProps) {
  const [rating, setRating] = useState<number | null>(null);
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
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setRating(null);
      setComment("");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <label>
        Rating (1-5):
        <input
          type="number"
          min={1}
          max={5}
          value={rating ?? ""}
          onChange={e => setRating(Number(e.target.value))}
          required
        />
      </label>
      <br />
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          required
        />
      </label>
      <br />
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
