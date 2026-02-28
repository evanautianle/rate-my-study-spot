"use client";
import SpotForm from "@/components/SpotForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AddSpotPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-background to-zinc-100 dark:to-zinc-900 p-8">
      <Card className="w-full max-w-3xl mx-auto rounded-2xl shadow-lg border bg-white dark:bg-zinc-950">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add a Study Spot</CardTitle>
        </CardHeader>
        <CardContent>
          <SpotForm onCreated={() => window.location.replace("/")} />
        </CardContent>
      </Card>
    </div>
  );
}
