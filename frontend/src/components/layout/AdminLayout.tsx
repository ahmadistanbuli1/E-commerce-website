import { Link, useLocation } from "react-router-dom";
import { AdminNotificationsBell } from "../admin/AdminNotificationsBell";
import {
  FolderTree,
  LayoutDashboard,
  Menu,
  Package,
  ScrollText,
  Search,
  ShoppingBag,
  Store,
  Users,
  X
} from "lucide-react";
import { useState } from "react";
import { useMe, useLogoutAndRedirect } from "../../hooks/auth";
import { ThemeToggle } from "../ui/ThemeToggle";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/activity", label: "Activity log", icon: ScrollText }
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const me = useMe();
  const logoutAndRedirect = useLogoutAndRedirect();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (to: string, end?: boolean) => {
    if (end) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
          <Store className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">E-Commerce</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
        <button
          type="button"
          className="ml-auto rounded-lg p-1 text-muted-foreground lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Main Menu
        </p>
        {links.map(({ to, label, icon: Icon, end }) => {
          const active = isActive(to, end);
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary-light text-primary shadow-sm dark:bg-primary/15 dark:text-blue-300"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Link
          to="/products"
          className="flex items-center justify-center rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:border-primary/30 hover:bg-primary-light hover:text-primary dark:hover:bg-primary/10"
        >
          Back to store
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden dark:bg-black/70"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card shadow-xl transition-transform duration-300 lg:translate-x-0 dark:shadow-black/40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg bg-primary p-2 text-primary-foreground shadow-md shadow-primary/30 transition-colors hover:bg-primary-hover lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-64 rounded-xl border border-border bg-muted py-2 pl-10 pr-4 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:bg-card focus:ring-2 focus:ring-ring/25 lg:w-80"
                  placeholder="Search..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle compact />
              <AdminNotificationsBell />

              <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white">
                  {me.data?.firstName?.[0] ?? "A"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-foreground">
                    {me.data ? `${me.data.firstName} ${me.data.lastName}` : "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">{me.data?.role ?? "ADMIN"}</p>
                </div>
                <button
                  type="button"
                  onClick={logoutAndRedirect}
                  className="ml-1 hidden rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:block"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
