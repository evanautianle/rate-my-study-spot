"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SpotForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [building, setBuilding] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, building }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create spot");
        setCreating(false);
        return;
      }
      setSuccess("Spot created!");
      setName("");
      setBuilding("");
      onCreated();
    } catch (err: any) {
      setError(err.message || "Error creating spot");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="mb-8 w-full max-w-md">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-semibold mb-2">Add a Study Spot</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Building"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <Button type="submit" className="w-full" disabled={creating}>
            {creating ? "Creating..." : "Create Spot"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
