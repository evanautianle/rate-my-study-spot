"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <div className="flex justify-between p-4 border-b">
      <Link href="/" className="font-bold">
        Rate My Study Spot
      </Link>

      <div className="space-x-4">
        {session ? (
          <>
            <span className="text-sm">Hi, {session.user?.name}</span>
            <Button variant="outline" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        )}
      </div>
    </div>
  )
}