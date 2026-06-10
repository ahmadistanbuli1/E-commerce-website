import type { LucideIcon } from "lucide-react";

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  trendUp
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        {trend ? (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              trendUp
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
          >
            {trend}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
