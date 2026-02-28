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
      .lean();
    return NextResponse.json(spots)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create spot" }, { status: 500 })
  }
}