import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import User from "@/models/User"

// Inline authOptions for getServerSession
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("No user found");
        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Invalid password");
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
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
}