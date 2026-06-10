import { AdminLayout } from "../../components/layout/AdminLayout";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminStatCard } from "../../components/admin/AdminStatCard";
import { useAdminRecentOrders, useAdminStats } from "../../hooks/admin";
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

  if (statsQuery.isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm">
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  if (statsQuery.isError || !statsQuery.data) {
    return (
      <AdminLayout>
        <div className="rounded-xl bg-white p-6 text-red-600 shadow-sm">
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
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
          trend="+ Live"
          trendUp
        />
        <AdminStatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue}`}
          icon={DollarSign}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          trend="All time"
          trendUp
        />
        <AdminStatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          icon={AlertTriangle}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          trend="Needs action"
          trendUp={false}
        />
        <AdminStatCard
          label="Active Users"
          value={stats.usersCount}
          icon={Users}
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
          trend="Registered"
          trendUp
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Revenue Overview</h2>
              <p className="text-sm text-slate-500">Recent orders revenue trend</p>
            </div>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                  />
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
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No order data yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Orders by Status</h2>
              <p className="text-sm text-slate-500">Distribution overview</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0"
                  }}
                />
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
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Low Stock Alert</h2>
          <p className="mt-1 text-sm text-slate-500">Products that need restocking</p>
          <div className="mt-4 space-y-2">
            {stats.lowStockProducts.length === 0 ? (
              <div className="rounded-xl bg-green-50 px-4 py-6 text-center text-sm text-green-700">
                All products have healthy stock levels.
              </div>
            ) : (
              stats.lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 transition-colors hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.category.name}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
          <p className="mt-1 text-sm text-slate-500">Latest customer purchases</p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Customer</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Total</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {(recentOrdersQuery.data ?? []).map((o) => (
                  <tr key={o.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-slate-800">
                        {o.user.firstName} {o.user.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{o.user.email}</p>
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
                    <td className="py-3 pr-4 font-semibold text-slate-800">${o.totalPrice}</td>
                    <td className="py-3 text-slate-500">
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
