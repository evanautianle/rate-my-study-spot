import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export type Spot = {
  _id: string;
  name: string;
  building: string;
  ratings: any[];
  comments: any[];
};

export default function SpotList({ spots }: { spots: Spot[] }) {
  if (!spots.length) {
    return <p>No study spots found.</p>;
  }
  return (
    <div className="w-full max-w-2xl space-y-4">
      {spots.map((spot) => (
        <Link href={`/spots/${spot._id}`} key={spot._id} className="block">
          <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {spot.name}
                {spot.ratings.length > 0 && (
                  <span className="text-base font-normal text-zinc-500">Avg: {(
                    spot.ratings.reduce((sum, r) => sum + (r.value ?? 0), 0) / spot.ratings.length
                  ).toFixed(1)}</span>
                )}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300">Building: {spot.building}</p>
              <p className="text-zinc-500 text-sm mt-2">Ratings: {spot.ratings.length} | Comments: {spot.comments.length}</p>
              {/* Comment/rating form removed from homepage. Only available on SpotDetail page. */}
              {spot.comments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Comments</h3>
                  <ul className="space-y-2">
                    {spot.comments.map((comment, idx) => {
                      // Find rating for this user if exists
                      const userRating = spot.ratings.find(r => r.userId?.toString() === comment.userId?.toString());
                      return (
                        <li key={comment._id || idx} className="bg-zinc-100 dark:bg-zinc-800 rounded p-2">
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-zinc-700 dark:text-zinc-200">{comment.text}</div>
                            {userRating && (
                              <span className="text-xs text-zinc-500">Rating: {userRating.value}</span>
                            )}
                          </div>
                          {comment.userId && comment.userId.name && (
                            <div className="text-xs text-zinc-500 mt-1">by {comment.userId.name}</div>
                          )}
                          {comment.createdAt && (
                            <div className="text-xs text-zinc-400">{new Date(comment.createdAt).toLocaleString()}</div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
