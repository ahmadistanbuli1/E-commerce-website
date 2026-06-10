import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MessageSquare, Package, ShoppingBag } from "lucide-react";
import { PageLayout } from "../components/layout/PageLayout";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge, orderStatusVariant } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { Button } from "../components/ui/Button";
import { useMyOrders } from "../hooks/orders";

export function OrdersPage() {
  const navigate = useNavigate();
  const ordersQuery = useMyOrders();

  useEffect(() => {
    if (
      ordersQuery.isError &&
      axios.isAxiosError(ordersQuery.error) &&
      ordersQuery.error.response?.status === 401
    ) {
      navigate("/login", { replace: true });
    }
  }, [ordersQuery.isError, ordersQuery.error, navigate]);

  return (
    <PageLayout>
      <PageHeader
        title="My orders"
        description="Track your purchases and delivery status."
      />

      {ordersQuery.isLoading ? (
        <LoadingState message="Loading orders..." />
      ) : ordersQuery.isError ? (
        <ErrorState
          message="Failed to load your orders."
          onRetry={() => ordersQuery.refetch()}
        />
      ) : (ordersQuery.data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="When you place an order, it will appear here."
          action={<Button onClick={() => navigate("/products")}>Start shopping</Button>}
        />
      ) : (
        <div className="space-y-4">
          {ordersQuery.data!.map((o) => (
            <Card key={o.id} hover>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Order ID</p>
                    <p className="font-mono text-sm text-slate-800">{o.id.slice(0, 12)}...</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant={orderStatusVariant(o.status)}>{o.status}</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500">Payment</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-800">{o.paymentMethod}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">${o.totalPrice}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3 sm:col-span-1">
                  <p className="text-xs text-slate-500">Items</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-800">
                    {o.items?.length ?? 0} product(s)
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Shipping address</p>
                <p className="mt-1 text-sm text-slate-800">{o.shippingAddress}</p>
              </div>

              {o.adminMessage ? (
                <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Message from store
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{o.adminMessage}</p>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
