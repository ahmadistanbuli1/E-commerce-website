import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, ShoppingBag } from "lucide-react";
import { PageLayout } from "../components/layout/PageLayout";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import { Select } from "../components/ui/Select";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingState } from "../components/ui/LoadingState";
import { useCart } from "../hooks/cart";
import { useCheckout } from "../hooks/orders";
import { ProductImage } from "../components/ui/ProductImage";

export function CheckoutPage() {
  const navigate = useNavigate();
  const cartQuery = useCart();
  const checkout = useCheckout();

  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [shippingAddress, setShippingAddress] = useState("");

  const cart = cartQuery.data;

  if (cartQuery.isLoading) {
    return (
      <PageLayout>
        <LoadingState message="Loading cart..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Checkout"
        description="Review your order and complete your purchase securely."
      />

      {!cart || cart.items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some products before checking out."
          action={
            <Button onClick={() => navigate("/products")}>Browse products</Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light dark:bg-primary/15">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h2 className="heading-3">Shipping details</h2>
            </div>

            <div className="mt-6 space-y-4">
              <Textarea
                label="Shipping address"
                rows={4}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Street, city, country..."
              />

              <Select
                label="Payment method"
                value={paymentMethod}
                onChange={setPaymentMethod}
                options={[
                  { value: "CARD", label: "Credit / Debit card" },
                  { value: "CASH", label: "Cash on delivery" }
                ]}
              />

              <Button
                fullWidth
                size="lg"
                disabled={checkout.isPending || shippingAddress.trim().length === 0}
                onClick={() =>
                  checkout.mutate(
                    { paymentMethod, shippingAddress: shippingAddress.trim() },
                    { onSuccess: () => navigate("/orders") }
                  )
                }
              >
                <CreditCard className="h-5 w-5" />
                Place order
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 dark:bg-violet-500/15">
                <ShoppingBag className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h2 className="heading-3">Order summary</h2>
            </div>

            <div className="mt-6 space-y-3">
              {cart.items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-3"
                >
                  <ProductImage
                    src={it.product.imageUrl}
                    alt={it.product.name}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{it.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {it.quantity} × ${it.unitPrice}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">${it.lineTotal}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">${cart.total}</p>
            </div>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}
