import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral";

const styles: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  info: "bg-blue-50 text-blue-700 ring-blue-200",
  neutral: "bg-slate-50 text-slate-700 ring-slate-200"
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
