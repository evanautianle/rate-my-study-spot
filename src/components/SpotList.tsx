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
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
                    <svg className="w-10 h-10 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
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
                </div>
              </div>
              {/* Comment/rating form removed from homepage. Only available on SpotDetail page. */}
              {spot.comments.length > 0 && (
                <div className="mt-6 ml-24">
                  <h3 className="text-lg font-medium mb-2">Comments</h3>
                  <ul className="space-y-2">
                    {spot.comments.slice(0, 2).map((comment, idx) => {
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
                  {spot.comments.length > 2 && (
                    <p className="text-sm text-zinc-500 mt-2">
                      +{spot.comments.length - 2} more comments
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
