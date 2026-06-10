import { useMemo, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminPagination } from "../../components/admin/AdminPagination";
import { OrderStatusDialog } from "../../components/admin/OrderStatusDialog";
import { OrderStatusMenu } from "../../components/admin/OrderStatusMenu";
import { DataTable } from "../../components/ui/DataTable";
import { TableSkeleton } from "../../components/ui/LoadingState";
import { useAdminOrders, useUpdateOrderStatus } from "../../hooks/admin";
import type { AdminOrder } from "../../hooks/admin";
import type { Order } from "../../hooks/orders";

export function AdminOrdersPage() {
  const ordersQuery = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [nextStatus, setNextStatus] = useState<Order["status"] | null>(null);

  const sorted = useMemo(() => {
    const rows = [...(ordersQuery.data ?? [])];
    rows.sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";
      if (sortKey === "totalPrice") {
        av = Number(a.totalPrice);
        bv = Number(b.totalPrice);
      } else if (sortKey === "status") {
        av = a.status;
        bv = b.status;
      } else {
        av = new Date(a.createdAt).getTime();
        bv = new Date(b.createdAt).getTime();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [ordersQuery.data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  const onSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const openStatusDialog = (order: AdminOrder, status: Order["status"]) => {
    setSelectedOrder(order);
    setNextStatus(status);
    setDialogOpen(true);
  };

  const handleConfirmStatus = (adminMessage: string) => {
    if (!selectedOrder || !nextStatus) return;
    updateStatus.mutate(
      { orderId: selectedOrder.id, status: nextStatus, adminMessage },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setSelectedOrder(null);
          setNextStatus(null);
        }
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="Orders Management"
          breadcrumb={[
            { label: "Dashboard", to: "/admin" },
            { label: "Orders" }
          ]}
        />

        {ordersQuery.isLoading ? (
          <TableSkeleton rows={6} />
        ) : (
          <>
            <DataTable
              rows={paged}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
              columns={[
                {
                  key: "id",
                  header: "Order",
                  render: (o) => <span className="font-mono text-xs">{o.id.slice(0, 10)}...</span>
                },
                {
                  key: "customer",
                  header: "Customer",
                  render: (o) => (
                    <div>
                      <p>{o.user ? `${o.user.firstName} ${o.user.lastName}` : o.userId}</p>
                      <p className="text-xs text-slate-500">{o.user?.email}</p>
                    </div>
                  )
                },
                {
                  key: "status",
                  header: "Status",
                  sortValue: (o) => o.status,
                  render: (o) => (
                    <OrderStatusMenu status={o.status} onSelect={(s) => openStatusDialog(o, s)} />
                  )
                },
                {
                  key: "totalPrice",
                  header: "Total",
                  sortValue: (o) => Number(o.totalPrice),
                  render: (o) => <span className="font-semibold">${o.totalPrice}</span>
                },
                {
                  key: "createdAt",
                  header: "Date",
                  sortValue: (o) => new Date(o.createdAt).getTime(),
                  render: (o) => new Date(o.createdAt).toLocaleString()
                }
              ]}
            />

            <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <OrderStatusDialog
        open={dialogOpen}
        order={selectedOrder}
        nextStatus={nextStatus}
        onClose={() => {
          setDialogOpen(false);
          setSelectedOrder(null);
          setNextStatus(null);
        }}
        onConfirm={handleConfirmStatus}
        isPending={updateStatus.isPending}
      />
    </AdminLayout>
  );
}
