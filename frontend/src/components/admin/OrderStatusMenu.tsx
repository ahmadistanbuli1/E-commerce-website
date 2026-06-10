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
      <Menu.Button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
        <AdminStatusBadge status={status} />
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </Menu.Button>

      <Menu.Items className="absolute left-0 z-30 mt-1 min-w-[11rem] rounded-xl border border-slate-100 bg-white p-1 shadow-lg focus:outline-none">
        {statuses.map((s) => (
          <Menu.Item key={s} disabled={s === status}>
            {({ active, disabled }) => (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(s)}
                className={cn(
                  "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm",
                  active && !disabled ? "bg-slate-50" : "",
                  disabled ? "cursor-not-allowed opacity-50" : "text-slate-700"
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
