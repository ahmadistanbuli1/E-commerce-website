import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "./Card";
import { Button } from "./Button";

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>
      <p className="text-lg font-semibold text-slate-800">{title}</p>
      {message ? <p className="mt-2 max-w-sm text-sm text-slate-500">{message}</p> : null}
      {onRetry ? (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </Card>
  );
}

export function InlineError({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
      {children}
    </div>
  );
}
