import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../route";
import { connectDB } from "@/lib/db";
import Spot from "@/models/Spot";

// PATCH: Add rating and/or comment to a spot
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rating, comment } = await req.json();
    if (!rating && !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();
    // Get userId from email
    const user = await import("@/models/User").then(m => m.default.findOne({ email: session.user.email }));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = user._id;

    const spot = await Spot.findById(params.id);
    if (!spot) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    // Add or update rating (single value for now)
    if (rating) {
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
      }
      spot.ratings = spot.ratings.filter((r: any) => r.userId.toString() !== userId.toString());
      spot.ratings.push({ userId, value: rating });
    }

    // Add comment
    if (comment) {
      if (typeof comment !== "string" || comment.trim().length === 0) {
        return NextResponse.json({ error: "Comment required" }, { status: 400 });
      }
      spot.comments.push({ userId, text: comment });
    }

    await spot.save();
    return NextResponse.json({ success: true, spot });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update spot" }, { status: 500 });
  }
}
