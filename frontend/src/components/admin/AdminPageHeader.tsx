import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function AdminPageHeader({
  title,
  breadcrumb
}: {
  title: string;
  breadcrumb?: { label: string; to?: string }[];
}) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {breadcrumb && breadcrumb.length > 0 ? (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          {breadcrumb.map((item, idx) => (
            <span key={item.label} className="flex items-center gap-1">
              {idx > 0 ? <ChevronRight className="h-4 w-4" /> : null}
              {item.to ? (
                <Link to={item.to} className="transition-colors hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground/80">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
