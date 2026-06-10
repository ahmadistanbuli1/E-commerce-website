import { Link } from "react-router-dom";
import { ProductImage } from "../components/ui/ProductImage";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from "../hooks/cart";

export function CartPage() {
  const cartQuery = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  if (cartQuery.isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-10">Loading...</div>;
  }

  const cart = cartQuery.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Cart</h1>
        <Link className="text-blue-700 hover:underline" to="/">
          Continue shopping
        </Link>
      </div>

      {!cart || cart.items.length === 0 ? (
        <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
          <p className="text-slate-700">Your cart is empty.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="rounded-lg bg-white p-4 shadow-md">
                  <div className="flex gap-4">
                    <div className="h-24 w-32 overflow-hidden rounded-md bg-slate-100">
                      <ProductImage className="h-full w-full object-cover" src={item.product.imageUrl} alt={item.product.name} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-500">{item.product.category.name}</p>
                          <h2 className="mt-1 font-semibold text-slate-900">{item.product.name}</h2>
                          <p className="mt-1 text-sm text-slate-600 line-clamp-2">{item.product.description}</p>
                        </div>
                        <button
                          type="button"
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition-colors duration-150 hover:bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                          onClick={() => removeItem.mutate(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-800 shadow-sm transition-colors duration-150 hover:bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            onClick={() => updateItem.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-10 text-center text-sm font-medium text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-800 shadow-sm transition-colors duration-150 hover:bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            onClick={() => updateItem.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-slate-600">Unit: ${item.unitPrice}</p>
                          <p className="font-bold text-slate-900">Line: ${item.lineTotal}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-md">
            <p className="text-sm text-slate-600">Total</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">${cart.total}</p>

            <button
              type="button"
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              disabled
            >
              Checkout (next phase)
            </button>

            <button
              type="button"
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition-colors duration-150 hover:bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              onClick={() => clearCart.mutate()}
              disabled={clearCart.isPending}
            >
              Clear cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

