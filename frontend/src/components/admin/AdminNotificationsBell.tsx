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
      <Menu.Button className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
        <Bell className="h-5 w-5" />
        {pending.length > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {pending.length > 9 ? "9+" : pending.length}
          </span>
        ) : null}
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-40 mt-2 w-80 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-xl focus:outline-none">
        <div className="border-b border-slate-100 px-3 py-2">
          <p className="text-sm font-semibold text-slate-800">Notifications</p>
          <p className="text-xs text-slate-500">
            {pending.length > 0
              ? `${pending.length} new order(s) awaiting review`
              : "No pending orders"}
          </p>
        </div>

        {pending.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-slate-500">You&apos;re all caught up.</div>
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
                      active ? "bg-blue-50" : "hover:bg-slate-50"
                    )}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                      <ShoppingBag className="h-4 w-4 text-blue-600" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-800">
                        New order · ${order.totalPrice}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
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

        <div className="border-t border-slate-100 p-2">
          <Link
            to="/admin/orders"
            className="block rounded-xl bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            View all orders
          </Link>
        </div>
      </Menu.Items>
    </Menu>
  );
}
