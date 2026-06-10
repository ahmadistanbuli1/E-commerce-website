import { Menu } from "@headlessui/react";
import { Bell, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminOrders } from "../../hooks/admin";
import { cn } from "../../utils/cn";

export function AdminNotificationsBell() {
  const navigate = useNavigate();
  const ordersQuery = useAdminOrders();
  const pending = (ordersQuery.data ?? []).filter((o) => o.status === "PENDING");

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative rounded-xl border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/25">
        <Bell className="h-5 w-5" />
        {pending.length > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-card">
            {pending.length > 9 ? "9+" : pending.length}
          </span>
        ) : null}
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-40 mt-2 w-80 origin-top-right rounded-2xl border border-border bg-card p-2 shadow-xl focus:outline-none dark:shadow-black/40">
        <div className="border-b border-border px-3 py-2">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          <p className="text-xs text-muted-foreground">
            {pending.length > 0
              ? `${pending.length} new order(s) awaiting review`
              : "No pending orders"}
          </p>
        </div>

        {pending.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            You&apos;re all caught up.
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto py-1">
            {pending.slice(0, 8).map((order) => (
              <Menu.Item key={order.id}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => navigate("/admin/orders")}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      active ? "bg-primary-light/60 dark:bg-primary/10" : "hover:bg-muted"
                    )}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light dark:bg-primary/15">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">
                        New order · ${order.totalPrice}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {order.user
                          ? `${order.user.firstName} ${order.user.lastName}`
                          : "Customer"}{" "}
                        · {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        )}

        <div className="border-t border-border p-2">
          <Link
            to="/admin/orders"
            className="block rounded-xl bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            View all orders
          </Link>
        </div>
      </Menu.Items>
    </Menu>
  );
}
