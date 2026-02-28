"use client";
import * as React from "react";
import { Button } from "@/components/ui/button"; // your ShadCN Button import

interface RatingSelectorProps {
  label: string;
  value: number | null;
  options: Array<number | { label: string; value: number }>;
  onChange: (value: number) => void;
  loading?: boolean;
}

export function RatingSelector({
  label,
  value,
  options,
  onChange,
  loading = false,
}: RatingSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-medium">{label}</span>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => {
          const optionValue = typeof opt === "number" ? opt : opt.value;
          const optionLabel = typeof opt === "number" ? opt : opt.label;

          return (
            <Button
              key={optionValue}
              variant={value === optionValue ? "default" : "outline"} // highlight selected
              size="sm"
              onClick={() => onChange(optionValue)}
              disabled={loading}
            >
              {optionLabel}
            </Button>
          );
        })}
      </div>
    </div>
  );
}