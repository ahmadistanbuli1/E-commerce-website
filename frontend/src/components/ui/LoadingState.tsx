import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";
import { Card } from "./Card";

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <Card className="flex items-center justify-center gap-3 py-12">
      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
      <p className="text-sm text-slate-600">{message}</p>
    </Card>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-slate-100", className)} />;
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="space-y-0 p-4">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="mb-3 h-10 w-full last:mb-0" />
        ))}
      </div>
    </Card>
  );
}
