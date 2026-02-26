import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await connectDB()

        const user = await User.findOne({ email: credentials?.email })
        if (!user) throw new Error("No user found")

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password
        )

        if (!isValid) throw new Error("Invalid password")

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }