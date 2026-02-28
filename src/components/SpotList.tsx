import { Card, CardContent } from "@/components/ui/card";
import SpotRatingCommentForm from "./SpotRatingCommentForm";

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
        <Card key={spot._id}>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold">{spot.name}</h2>
            <p className="text-zinc-600 dark:text-zinc-300">Building: {spot.building}</p>
            <p className="text-zinc-500 text-sm mt-2">Ratings: {spot.ratings.length} | Comments: {spot.comments.length}</p>
            <div className="mt-4">
              <SpotRatingCommentForm spotId={spot._id} onSuccess={() => window.location.reload()} />
            </div>
            {spot.comments.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Comments</h3>
                <ul className="space-y-2">
                  {spot.comments.map((comment, idx) => (
                    <li key={comment._id || idx} className="bg-zinc-100 dark:bg-zinc-800 rounded p-2">
                      <div className="text-sm text-zinc-700 dark:text-zinc-200">{comment.text}</div>
                      {comment.userId && comment.userId.name && (
                        <div className="text-xs text-zinc-500 mt-1">by {comment.userId.name}</div>
                      )}
                      {comment.createdAt && (
                        <div className="text-xs text-zinc-400">{new Date(comment.createdAt).toLocaleString()}</div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
