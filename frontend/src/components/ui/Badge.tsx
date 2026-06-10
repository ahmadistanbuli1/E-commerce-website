import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral";

const styles: Record<BadgeVariant, string> = {
  success:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-500/30",
  danger:
    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/15 dark:text-red-400 dark:ring-red-500/30",
  warning:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:ring-amber-500/30",
  info: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:ring-blue-500/30",
  neutral:
    "bg-muted text-foreground/80 ring-border dark:bg-muted dark:text-foreground/80 dark:ring-border"
};

export function Badge({
  children,
  variant = "neutral",
  className
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function orderStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "DELIVERED":
      return "success";
    case "CANCELLED":
      return "danger";
    case "PENDING":
      return "warning";
    case "PROCESSING":
    case "SHIPPED":
      return "info";
    default:
      return "neutral";
  }
}
