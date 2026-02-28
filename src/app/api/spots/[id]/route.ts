// GET: Fetch a single study spot by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const awaitedParams = typeof params.then === "function" ? await params : params;
    const spot = await Spot.findById(awaitedParams.id)
      .populate("ratings.userId", "name email")
      .populate("comments.userId", "name email")
      .lean();
    if (!spot) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }
    return NextResponse.json(spot);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch spot" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../route";
import { connectDB } from "@/lib/db";
import Spot from "@/models/Spot";
// DELETE: Remove user's own comment from a spot
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = await req.json();
    if (!commentId) {
      return NextResponse.json({ error: "Missing commentId" }, { status: 400 });
    }

    await connectDB();
    // Get userId from email
    const user = await import("@/models/User").then(m => m.default.findOne({ email: session.user.email }));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = user._id;

    const awaitedParams = typeof params.then === "function" ? await params : params;
    const spot = await Spot.findById(awaitedParams.id);
    if (!spot) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    // Remove comment if it belongs to the user
    const initialLength = spot.comments.length;
    spot.comments = spot.comments.filter((c: any) => {
      return !(c._id.toString() === commentId && c.userId.toString() === userId.toString());
    });

    if (spot.comments.length === initialLength) {
      return NextResponse.json({ error: "Comment not found or not owned by user" }, { status: 404 });
    }

    await spot.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}

// PATCH: Add rating and/or comment to a spot
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rating, comment } = await req.json();
    if (rating === undefined && comment === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();
    // Get userId from email
    const user = await import("@/models/User").then(m => m.default.findOne({ email: session.user.email }));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = user._id;

    const awaitedParams = typeof params.then === "function" ? await params : params;
    const spot = await Spot.findById(awaitedParams.id);
    if (!spot) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    // Add or update rating
    if (rating !== undefined) {
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
      }
      spot.ratings = spot.ratings.filter((r: any) => r.userId.toString() !== userId.toString());
      spot.ratings.push({ userId, value: rating });
    }

    // Add comment
    if (comment !== undefined) {
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
