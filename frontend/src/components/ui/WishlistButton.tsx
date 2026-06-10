import { Heart } from "lucide-react";

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
      className={`inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 active:scale-95 ${className}`}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-4 w-4 transition-colors duration-200 ${
          active ? "fill-red-500 text-red-500" : "text-slate-600"
        }`}
      />
    </button>
  );
}

