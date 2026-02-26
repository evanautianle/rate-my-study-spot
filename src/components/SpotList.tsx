import { Card, CardContent } from "@/components/ui/card";

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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
