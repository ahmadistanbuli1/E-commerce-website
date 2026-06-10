import { cn } from "../../utils/cn";
import { computeDiscountPercent, isOnSale } from "../../utils/product";

export { isOnSale, computeDiscountPercent };

export function ProductPrice({
  price,
  compareAtPrice,
  discountPercent,
  size = "md",
  showDiscountBadge = true,
  className
}: {
  price: string;
  compareAtPrice?: string | null;
  discountPercent?: number | null;
  size?: "sm" | "md" | "lg";
  showDiscountBadge?: boolean;
  className?: string;
}) {
  const onSale = isOnSale(price, compareAtPrice);
  const percent = discountPercent ?? computeDiscountPercent(price, compareAtPrice);

  const currentSize = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-3xl"
  }[size];

  const oldSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg"
  }[size];

  const badgeSize = size === "lg" ? "text-sm px-2.5 py-1" : "text-[10px] px-2 py-0.5";

  if (!onSale) {
    return (
      <p className={cn("font-bold tracking-tight text-foreground", currentSize, className)}>
        ${price}
      </p>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-medium text-muted-foreground line-through", oldSize)}>
        ${compareAtPrice}
      </span>
      <span className={cn("font-bold tracking-tight text-red-500 dark:text-red-400", currentSize)}>
        ${price}
      </span>
      {showDiscountBadge && percent !== null ? (
        <span
          className={cn(
            "rounded-full bg-red-500 font-bold uppercase tracking-wide text-white",
            badgeSize
          )}
        >
          -{percent}%
        </span>
      ) : null}
    </div>
  );
}

export function DiscountBadge({
  discountPercent,
  className
}: {
  discountPercent?: number | null;
  className?: string;
}) {
  if (!discountPercent || discountPercent <= 0) return null;

  return (
    <span
      className={cn(
        "rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm",
        className
      )}
    >
      -{discountPercent}%
    </span>
  );
}

export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm",
        className
      )}
    >
      New
    </span>
  );
}
