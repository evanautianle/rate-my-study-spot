import { NextRequest, NextResponse } from "next/server";
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
