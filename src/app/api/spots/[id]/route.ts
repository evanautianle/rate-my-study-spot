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
    const body = await req.json();
    console.log("PATCH request body:", body);
    const { quietness, comfort, seatAvailability, outletAvailability, wifiConnection, rating, comment } = body;

    // Debug the specific values we're concerned about
    console.log("Rating values debug:", {
      seatAvailability,
      outletAvailability,
      wifiConnection,
      seatAvailabilityType: typeof seatAvailability,
      outletAvailabilityType: typeof outletAvailability,
      wifiConnectionType: typeof wifiConnection
    });

    // At least one field must be present
    if (
      rating === undefined &&
      quietness === undefined &&
      comfort === undefined &&
      seatAvailability === undefined &&
      outletAvailability === undefined &&
      wifiConnection === undefined &&
      comment === undefined
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();
    console.log("Database connected");
    
    // Get session and userId
    const patchSession = await getServerSession(authOptions);
    console.log("Session retrieved:", patchSession ? "Session exists" : "No session");
    
    if (!patchSession || !patchSession.user || !patchSession.user.email) {
      console.log("Authentication failed - no valid session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = await import("@/models/User").then(m => m.default.findOne({ email: patchSession.user.email }));
    console.log("User found:", user ? "Yes" : "No");
    
    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userId = user._id;

    const awaitedParams = typeof params.then === "function" ? await params : params;
    console.log("Spot ID from params:", awaitedParams.id);
    
    const spot = await Spot.findById(awaitedParams.id);
    console.log("Spot found:", spot ? "Yes" : "No");
    
    if (!spot) {
      console.log("Spot not found in database");
      return NextResponse.json({ error: "Spot not found" }, { status: 404 });
    }

    // Remove existing rating by this user
    spot.ratings = spot.ratings.filter((r: any) => r.userId.toString() !== userId.toString());

    // Only add a rating if any rating field is present
    if (
      rating !== undefined ||
      quietness !== undefined ||
      comfort !== undefined ||
      seatAvailability !== undefined ||
      outletAvailability !== undefined ||
      wifiConnection !== undefined
    ) {
      // Validate all required fields are 1-5
      const allFields = { quietness, comfort, seatAvailability, outletAvailability, wifiConnection };
      for (const [field, value] of Object.entries(allFields)) {
        if (!value || value < 1 || value > 5) {
          return NextResponse.json({ error: `${field} must be between 1-5` }, { status: 400 });
        }
      }

      const newRating = {
        userId,
        value: Number(rating) || 1,
        quietness: Number(quietness),
        comfort: Number(comfort),
        seatAvailability: Number(seatAvailability),
        outletAvailability: Number(outletAvailability),
        wifiConnection: Number(wifiConnection),
        overallRating: Number(rating) || 1,
      };
      console.log("Creating new rating with types:", {
        ...newRating,
        seatAvailabilityType: typeof newRating.seatAvailability,
        outletAvailabilityType: typeof newRating.outletAvailability,
        wifiConnectionType: typeof newRating.wifiConnection,
      });
      
      spot.ratings.push(newRating);
      console.log("Rating added to spot. Total ratings:", spot.ratings.length);
    }

    // Add comment if provided
    if (comment !== undefined) {
      if (typeof comment !== "string" || comment.trim().length === 0) {
        return NextResponse.json({ error: "Comment required" }, { status: 400 });
      }
      spot.comments.push({ userId, text: comment });
    }

    try {
      console.log("Saving spot with ratings:", spot.ratings);
      console.log("Spot ID:", spot._id);
      await spot.save();
      console.log("Spot saved successfully");
    } catch (err) {
      console.error("Mongoose save error:", err);
      console.error("Spot data that failed to save:", JSON.stringify(spot, null, 2));
      throw err;
    }
    return NextResponse.json({ success: true, spot });
  } catch (error) {
    console.error("PATCH request error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json({ 
      error: "Failed to update spot",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
