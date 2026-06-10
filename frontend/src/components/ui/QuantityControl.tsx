import { Minus, Plus } from "lucide-react";
import { cn } from "../../utils/cn";

export function QuantityControl({
  value,
  min = 1,
  max,
  onChange,
  size = "md"
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}) {
  const btnClass = size === "sm" ? "p-1.5" : "p-2.5";

  return (
    <div className="inline-flex items-center rounded-xl border border-border bg-muted">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          "rounded-l-xl text-foreground/70 transition-colors hover:bg-card disabled:opacity-40",
          btnClass
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        className={cn(
          "min-w-[2.5rem] text-center font-semibold text-foreground",
          size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
        disabled={max !== undefined && value >= max}
        className={cn(
          "rounded-r-xl text-foreground/70 transition-colors hover:bg-card disabled:opacity-40",
          btnClass
        )}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
