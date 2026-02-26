import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

// Protect POST (spot creation) so only logged-in users can create spots
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // TODO: Implement spot creation logic here
  return NextResponse.json({ message: "Spot creation endpoint (protected)" });
}

// Placeholder for GET (fetch spots)
export async function GET() {
  // TODO: Implement spot fetching logic here
  return NextResponse.json({ message: "Spot fetching endpoint" });
}
