import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-black"
      style={{ marginTop: 16 }}
    >
      <div className="flex items-center gap-2">
        <label htmlFor="rating" className="font-medium text-sm text-black dark:text-white">Rating:</label>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(num => (
            <Button
              type="button"
              key={num}
              variant={rating === num ? "default" : "outline"}
              className={`h-8 w-8 p-0 border-zinc-300 dark:border-zinc-700 ${rating === num ? "bg-black text-white" : "bg-white text-black"}`}
              onClick={() => setRating(num)}
              aria-label={`Rate ${num}`}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="font-medium text-sm text-black dark:text-white">Comment:</label>
        <Textarea
          id="comment"
          className="w-full mt-1"
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          required
          placeholder="Write your thoughts..."
        />
      </div>
      <Button
        type="submit"
        disabled={loading || !rating || !comment.trim()}
        className="w-full bg-black dark:bg-white text-white dark:text-black border border-zinc-300 dark:border-zinc-700"
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </form>
  );
}
