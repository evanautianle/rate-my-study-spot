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
  const [noise, setNoise] = useState<number | null>(null);
  const [comfort, setComfort] = useState<number | null>(null);
  const [outletAvailability, setOutletAvailability] = useState<number | null>(null);
  const [wifiConnection, setWifiConnection] = useState<number | null>(null);
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
        body: JSON.stringify({
          rating,
          noise,
          comfort,
          outletAvailability,
          wifiConnection,
          comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setRating(null);
      setNoise(null);
      setComfort(null);
      setOutletAvailability(null);
      setWifiConnection(null);
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
        <label htmlFor="rating" className="font-medium text-sm text-black dark:text-white">Overall Rating:</label>
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
      <div className="flex items-center gap-2">
        <label htmlFor="noise" className="font-medium text-sm text-black dark:text-white">Noise:</label>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(num => (
            <Button
              type="button"
              key={num}
              variant={noise === num ? "default" : "outline"}
              className={`h-8 w-8 p-0 border-zinc-300 dark:border-zinc-700 ${noise === num ? "bg-black text-white" : "bg-white text-black"}`}
              onClick={() => setNoise(num)}
              aria-label={`Noise ${num}`}
            >{num}</Button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="comfort" className="font-medium text-sm text-black dark:text-white">Comfort:</label>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(num => (
            <Button
              type="button"
              key={num}
              variant={comfort === num ? "default" : "outline"}
              className={`h-8 w-8 p-0 border-zinc-300 dark:border-zinc-700 ${comfort === num ? "bg-black text-white" : "bg-white text-black"}`}
              onClick={() => setComfort(num)}
              aria-label={`Comfort ${num}`}
            >{num}</Button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="outletAvailability" className="font-medium text-sm text-black dark:text-white">Outlet Availability:</label>
        <div className="flex gap-1">
          {[
            { label: "N/A", value: 0 },
            { label: "Poor", value: 1 },
            { label: "Mediocre", value: 2 },
            { label: "Good", value: 3 },
          ].map(opt => (
            <Button
              type="button"
              key={opt.value}
              variant={outletAvailability === opt.value ? "default" : "outline"}
              className={`h-8 px-2 py-1 border-zinc-300 dark:border-zinc-700 ${outletAvailability === opt.value ? "bg-black text-white" : "bg-white text-black"}`}
              onClick={() => setOutletAvailability(opt.value)}
              aria-label={`Outlet Availability ${opt.label}`}
            >{opt.label}</Button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="wifiConnection" className="font-medium text-sm text-black dark:text-white">WiFi Connection:</label>
        <div className="flex gap-1">
          {[
            { label: "N/A", value: 0 },
            { label: "Poor", value: 1 },
            { label: "Mediocre", value: 2 },
            { label: "Good", value: 3 },
          ].map(opt => (
            <Button
              type="button"
              key={opt.value}
              variant={wifiConnection === opt.value ? "default" : "outline"}
              className={`h-8 px-2 py-1 border-zinc-300 dark:border-zinc-700 ${wifiConnection === opt.value ? "bg-black text-white" : "bg-white text-black"}`}
              onClick={() => setWifiConnection(opt.value)}
              aria-label={`WiFi Connection ${opt.label}`}
            >{opt.label}</Button>
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
