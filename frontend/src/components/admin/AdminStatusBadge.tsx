const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 ring-blue-200",
  SHIPPED: "bg-violet-50 text-violet-700 ring-violet-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200",
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Banned: "bg-red-50 text-red-700 ring-red-200",
  ADMIN: "bg-violet-50 text-violet-700 ring-violet-200",
  CUSTOMER: "bg-slate-50 text-slate-700 ring-slate-200"
};

export function AdminStatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? "bg-slate-50 text-slate-700 ring-slate-200";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style}`}
    >
      {status}
    </span>
  );
}
