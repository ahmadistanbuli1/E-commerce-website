import { AdminLayout } from "../../components/layout/AdminLayout";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminStatCard } from "../../components/admin/AdminStatCard";
import { useAdminRecentOrders, useAdminStats } from "../../hooks/admin";
import { useChartTheme } from "../../hooks/useChartTheme";
import {
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Users
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const statusColors: Record<string, string> = {
  PENDING: "#f59e0b",
  PROCESSING: "#3b82f6",
  SHIPPED: "#8b5cf6",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444"
};

export function AdminDashboardPage() {
  const statsQuery = useAdminStats();
  const recentOrdersQuery = useAdminRecentOrders();
  const chartTheme = useChartTheme();

  if (statsQuery.isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center rounded-xl bg-card shadow-sm">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  if (statsQuery.isError || !statsQuery.data) {
    return (
      <AdminLayout>
        <div className="rounded-xl bg-card p-6 text-red-500 shadow-sm dark:text-red-400">
          Failed to load dashboard.
        </div>
      </AdminLayout>
    );
  }

  const stats = statsQuery.data;
  const chartData = stats.ordersByStatus.map((s) => ({
    status: s.status,
    count: s.count,
    fill: statusColors[s.status] ?? "#64748b"
  }));

  const revenueTrend = (recentOrdersQuery.data ?? [])
    .slice()
    .reverse()
    .map((o, idx) => ({
      name: `#${idx + 1}`,
      revenue: Number(o.totalPrice)
    }));

  return (
    <AdminLayout>
      <AdminPageHeader
        title="eCommerce Dashboard"
        breadcrumb={[{ label: "Dashboard", to: "/admin" }, { label: "eCommerce" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          iconBg="bg-violet-100 dark:bg-violet-500/15"
          iconColor="text-violet-600 dark:text-violet-400"
          trend="+ Live"
          trendUp
        />
        <AdminStatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue}`}
          icon={DollarSign}
          iconBg="bg-emerald-100 dark:bg-emerald-500/15"
          iconColor="text-emerald-600 dark:text-emerald-400"
          trend="All time"
          trendUp
        />
        <AdminStatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          icon={AlertTriangle}
          iconBg="bg-amber-100 dark:bg-amber-500/15"
          iconColor="text-amber-600 dark:text-amber-400"
          trend="Needs action"
          trendUp={false}
        />
        <AdminStatCard
          label="Active Users"
          value={stats.usersCount}
          icon={Users}
          iconBg="bg-sky-100 dark:bg-sky-500/15"
          iconColor="text-sky-600 dark:text-sky-400"
          trend="Registered"
          trendUp
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="panel-base xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Revenue Overview</h2>
              <p className="text-sm text-muted-foreground">Recent orders revenue trend</p>
            </div>
            <span className="rounded-lg border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Recent
            </span>
          </div>
          <div className="h-72">
            {revenueTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke={chartTheme.axis} />
                  <YAxis tick={{ fontSize: 12 }} stroke={chartTheme.axis} />
                  <Tooltip contentStyle={chartTheme.tooltip} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No order data yet.
              </div>
            )}
          </div>
        </div>

        <div className="panel-base xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Orders by Status</h2>
              <p className="text-sm text-muted-foreground">Distribution overview</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} stroke={chartTheme.axis} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke={chartTheme.axis} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="panel-base">
          <h2 className="text-lg font-semibold text-foreground">Low Stock Alert</h2>
          <p className="mt-1 text-sm text-muted-foreground">Products that need restocking</p>
          <div className="mt-4 space-y-2">
            {stats.lowStockProducts.length === 0 ? (
              <div className="rounded-xl bg-emerald-500/10 px-4 py-6 text-center text-sm text-emerald-600 dark:text-emerald-400">
                All products have healthy stock levels.
              </div>
            ) : (
              stats.lowStockProducts.map((p) => (
                <div key={p.id} className="list-row flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category.name}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500 dark:text-red-400">
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel-base">
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
          <p className="mt-1 text-sm text-muted-foreground">Latest customer purchases</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Customer</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Total</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {(recentOrdersQuery.data ?? []).map((o) => (
                  <tr key={o.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-foreground">
                        {o.user.firstName} {o.user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{o.user.email}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${statusColors[o.status]}20`,
                          color: statusColors[o.status]
                        }}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-semibold text-foreground">${o.totalPrice}</td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
