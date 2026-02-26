import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectDB } from "@/lib/db"
import Spot from "@/models/Spot"

// GET: Fetch all study spots
export async function GET() {
  try {
    await connectDB()
    // Populate ratings and comments with user info if needed
    const spots = await Spot.find({})
      .populate("ratings.userId", "name email")
      .populate("comments.userId", "name email")
      .lean()
    return NextResponse.json(spots)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch spots" }, { status: 500 })
  }
}

// POST: Create a new study spot (protected)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, building } = await req.json()
    if (!name || !building) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    await connectDB()

    // Optionally, check for duplicate spot name/building
    const existing = await Spot.findOne({ name, building })
    if (existing) {
      return NextResponse.json({ error: "Spot already exists" }, { status: 400 })
    }

    // Get userId from session
    // You may want to fetch the user to get their _id
    const userId = session.user.id

    const spot = await Spot.create({
      name,
      building,
      ratings: [],
      comments: [],
      createdBy: userId,
    })

    return NextResponse.json(spot, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create spot" }, { status: 500 })
  }
}import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Spot from "@/models/Spot";

// Protect POST (spot creation) so only logged-in users can create spots
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await req.json();
    const { name, building } = body;
    if (!name || !building) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const spot = await Spot.create({ name, building });
    return NextResponse.json(spot, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create spot" }, { status: 500 });
  }
}

// Placeholder for GET (fetch spots)
export async function GET() {
  try {
    await connectDB();
    const spots = await Spot.find().sort({ createdAt: -1 });
    return NextResponse.json(spots);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch spots" }, { status: 500 });
  }
}
