"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <Card className="rounded-none border-b shadow-none bg-background">
      <CardHeader className="px-6 py-4">
        <div className="flex flex-row items-center justify-between w-full">
          <CardTitle className="font-bold text-lg">
            <Link href="/" className="hover:underline">Rate My Study Spot</Link>
          </CardTitle>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/add-spot">Add Spot</Link>
            </Button>
            {session ? (
              <>
                <span className="text-sm text-muted-foreground">Hi, {session.user?.name}</span>
                <Button variant="outline" onClick={() => signOut()}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/signup">Signup</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}