import { Heart } from "lucide-react";
import { cn } from "../../utils/cn";

export function WishlistButton({
  active,
  onClick,
  className = ""
}: {
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-border bg-card p-2.5 text-foreground/80 shadow-sm transition-all duration-200 hover:bg-muted focus:border-primary focus:ring-2 focus:ring-ring/25 active:scale-95",
        className
      )}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors duration-200",
          active ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )}
      />
    </button>
  );
}
