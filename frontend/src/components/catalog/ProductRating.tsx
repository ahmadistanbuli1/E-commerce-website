import { Star } from "lucide-react";
import { cn } from "../../utils/cn";

export function ProductRating({
  rating,
  count,
  size = "sm",
  showCount = true,
  className
}: {
  rating?: number | null;
  count?: number;
  size?: "sm" | "md";
  showCount?: boolean;
  className?: string;
}) {
  const value = rating ?? 0;
  const starSize = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  const display = value > 0 ? value.toFixed(1) : "—";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = value >= i + 1;
          const half = !filled && value > i && value < i + 1;
          return (
            <Star
              key={i}
              className={cn(
                starSize,
                filled
                  ? "fill-amber-400 text-amber-400"
                  : half
                    ? "fill-amber-200 text-amber-400 dark:fill-amber-500/30"
                    : "fill-muted text-border dark:fill-zinc-700 dark:text-zinc-600"
              )}
            />
          );
        })}
      </div>
      <span className={cn("font-medium text-foreground/80", size === "md" ? "text-sm" : "text-xs")}>
        {display}
      </span>
      {showCount && count !== undefined ? (
        <span className={cn("text-muted-foreground", size === "md" ? "text-sm" : "text-xs")}>
          ({count})
        </span>
      ) : null}
    </div>
  );
}

export function StarRatingInput({
  value,
  onChange,
  disabled
}: {
  value: number;
  onChange: (score: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const score = i + 1;
        const active = score <= value;
        return (
          <button
            key={score}
            type="button"
            disabled={disabled}
            onClick={() => onChange(score)}
            className="rounded p-0.5 transition hover:scale-110 disabled:opacity-50"
            aria-label={`Rate ${score} stars`}
          >
            <Star
              className={cn(
                "h-6 w-6",
                active
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-border dark:fill-zinc-700 dark:text-zinc-600"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
