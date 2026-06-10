const statusStyles: Record<string, string> = {
  PENDING:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:ring-amber-500/30",
  PROCESSING:
    "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:ring-blue-500/30",
  SHIPPED:
    "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-400 dark:ring-violet-500/30",
  DELIVERED:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-500/30",
  CANCELLED:
    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/15 dark:text-red-400 dark:ring-red-500/30",
  Active:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-500/30",
  Banned:
    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/15 dark:text-red-400 dark:ring-red-500/30",
  ADMIN:
    "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-400 dark:ring-violet-500/30",
  CUSTOMER:
    "bg-muted text-foreground/80 ring-border dark:bg-muted dark:text-foreground/80 dark:ring-border"
};

const fallbackStyle =
  "bg-muted text-foreground/80 ring-border dark:bg-muted dark:text-foreground/80 dark:ring-border";

export function AdminStatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? fallbackStyle;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style}`}
    >
      {status}
    </span>
  );
}
