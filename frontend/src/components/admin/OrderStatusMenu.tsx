import { Menu } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { cn } from "../../utils/cn";
import type { Order } from "../../hooks/orders";

const statuses: Order["status"][] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrderStatusMenu({
  status,
  onSelect
}: {
  status: Order["status"];
  onSelect: (status: Order["status"]) => void;
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/25">
        <AdminStatusBadge status={status} />
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </Menu.Button>

      <Menu.Items className="absolute left-0 z-30 mt-1 min-w-[11rem] rounded-xl border border-border bg-card p-1 shadow-lg focus:outline-none dark:shadow-black/40">
        {statuses.map((s) => (
          <Menu.Item key={s} disabled={s === status}>
            {({ active, disabled }) => (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(s)}
                className={cn(
                  "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm",
                  active && !disabled ? "bg-muted" : "",
                  disabled ? "cursor-not-allowed opacity-50" : "text-foreground/80"
                )}
              >
                <AdminStatusBadge status={s} />
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
