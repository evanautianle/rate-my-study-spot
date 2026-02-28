"use client";
import { Button } from "@/components/ui/button";

interface RatingSelectorProps {
  label: string;
  value: number | null;
  options: number[] | { label: string; value: number }[];
  onChange: (val: number) => void;
  loading?: boolean;
}

export function RatingSelector({ label, value, options, onChange, loading }: RatingSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="font-medium text-sm text-black dark:text-white">{label}:</label>
      <div className="flex gap-1">
        {options.map(opt => {
          const val = typeof opt === "number" ? opt : opt.value;
          const labelText = typeof opt === "number" ? opt : opt.label;
          return (
            <Button
              key={val}
              type="button"
              variant={value === val ? "default" : "outline"}
              className={`h-8 px-2 py-1 border-zinc-300 dark:border-zinc-700 ${value === val ? "bg-black text-white" : "bg-white text-black"}`}
              onClick={() => onChange(val)}
              disabled={loading}
              aria-label={`${label} ${labelText}`}
            >
              {labelText}
            </Button>
          );
        })}
      </div>
    </div>
  );
}