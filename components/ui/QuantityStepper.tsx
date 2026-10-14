"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  size = "md",
  label = "Cantidad",
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const h = size === "sm" ? "h-10" : "h-12";
  return (
    <div
      className={cn(
        "inline-flex items-stretch rounded-[var(--radius)] border border-line-strong",
        h,
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Quitar una unidad"
        className={cn(
          "inline-flex items-center justify-center text-fg transition-colors hover:bg-fg/6 disabled:opacity-35",
          size === "sm" ? "w-10" : "w-12",
        )}
      >
        <Minus className="size-4" strokeWidth={1.5} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
        className="w-12 [appearance:textfield] border-x border-line bg-transparent text-center !text-[0.9375rem] font-semibold tabular-nums outline-none focus-visible:bg-fg/5 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Añadir una unidad"
        className={cn(
          "inline-flex items-center justify-center text-fg transition-colors hover:bg-fg/6 disabled:opacity-35",
          size === "sm" ? "w-10" : "w-12",
        )}
      >
        <Plus className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
