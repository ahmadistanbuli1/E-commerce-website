import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { PageLayout } from "../components/layout/PageLayout";
import { ProductImage } from "../components/ui/ProductImage";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { QuantityControl } from "../components/ui/QuantityControl";
import { LoadingState } from "../components/ui/LoadingState";
import { EmptyState } from "../components/ui/EmptyState";
import { useCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from "../hooks/cart";
import { ShoppingBag } from "lucide-react";

export function CartPage() {
  const cartQuery = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  if (cartQuery.isLoading) {
    return (
      <PageLayout>
        <LoadingState message="Loading cart..." />
      </PageLayout>
    );
  }

  const cart = cartQuery.data;

  return (
    <PageLayout>
      <div className="flex items-center justify-between">
        <h1 className="heading-2">Cart</h1>
        <Link className="text-sm font-medium text-primary hover:underline" to="/products">
          Continue shopping
        </Link>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Browse products and add items to your cart."
            action={
              <Link to="/products">
                <Button>Shop now</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.items.map((item) => (
              <Card key={item.id} padding="sm">
                <div className="flex gap-4">
                  <div className="h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-border">
                    <ProductImage
                      className="h-full w-full object-cover"
                      src={item.product.imageUrl}
                      alt={item.product.name}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{item.product.category.name}</p>
                        <h2 className="mt-1 font-semibold text-foreground">{item.product.name}</h2>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {item.product.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                        onClick={() => removeItem.mutate(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <QuantityControl
                        value={item.quantity}
                        min={1}
                        onChange={(q) => updateItem.mutate({ itemId: item.id, quantity: q })}
                      />
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Unit: ${item.unitPrice}</p>
                        <p className="font-bold text-foreground">Line: ${item.lineTotal}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card padding="sm" className="h-fit">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="mt-1 text-2xl font-bold text-foreground">${cart.total}</p>

            <Link to="/checkout" className="mt-4 block">
              <Button fullWidth>Checkout</Button>
            </Link>

            <Button
              variant="outline"
              fullWidth
              className="mt-3"
              onClick={() => clearCart.mutate()}
              disabled={clearCart.isPending}
            >
              Clear cart
            </Button>
          </Card>
        </div>
      )}
    </PageLayout>
  );
}
