import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useMemo } from "react";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setCartOpen } from "../../app/features/ui/uiSlice";
import { useAuthSession } from "../../hooks/auth";
import { useCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from "../../hooks/cart";
import { useNavigate } from "react-router-dom";
import { ProductImage } from "../ui/ProductImage";
import { Button } from "../ui/Button";
import { QuantityControl } from "../ui/QuantityControl";
import { EmptyState } from "../ui/EmptyState";
import { LoadingState } from "../ui/LoadingState";

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.cartOpen);
  const navigate = useNavigate();

  const { isLoggedIn } = useAuthSession();
  const cartQuery = useCart(isLoggedIn);
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  const cart = cartQuery.data;

  const count = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((acc, it) => acc + it.quantity, 0);
  }, [cart]);

  const close = () => dispatch(setCartOpen(false));

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-200"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-150"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                      <div>
                        <Dialog.Title className="heading-3">Your cart</Dialog.Title>
                        <p className="text-sm text-slate-500">{count} item(s)</p>
                      </div>
                      <button
                        type="button"
                        onClick={close}
                        className="rounded-xl border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-auto p-4">
                      {cartQuery.isLoading ? (
                        <LoadingState message="Loading cart..." />
                      ) : !cart || cart.items.length === 0 ? (
                        <EmptyState
                          icon={ShoppingBag}
                          title="Cart is empty"
                          description="Browse products and add items to your cart."
                          action={
                            <Button
                              size="sm"
                              onClick={() => {
                                close();
                                navigate("/products");
                              }}
                            >
                              Shop now
                            </Button>
                          }
                        />
                      ) : (
                        <div className="space-y-3">
                          {cart.items.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                            >
                              <div className="flex gap-3">
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                                  <ProductImage
                                    className="h-full w-full object-cover"
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold text-slate-900">
                                    {item.product.name}
                                  </p>
                                  <p className="text-xs text-slate-500">{item.product.category.name}</p>
                                  <div className="mt-2 flex items-center justify-between gap-2">
                                    <QuantityControl
                                      size="sm"
                                      value={item.quantity}
                                      min={1}
                                      onChange={(q) =>
                                        updateItem.mutate({ itemId: item.id, quantity: q })
                                      }
                                    />
                                    <button
                                      type="button"
                                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                      onClick={() => removeItem.mutate(item.id)}
                                      aria-label="Remove"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2 flex items-center justify-between text-sm">
                                <p className="text-slate-500">Unit: ${item.unitPrice}</p>
                                <p className="font-semibold text-slate-900">${item.lineTotal}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600">Subtotal</p>
                        <p className="text-xl font-bold text-slate-900">${cart?.total ?? "0.00"}</p>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button
                          fullWidth
                          disabled={!cart || cart.items.length === 0}
                          onClick={() => {
                            close();
                            navigate("/checkout");
                          }}
                        >
                          Checkout
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => clearCart.mutate()}
                          disabled={clearCart.isPending || !cart || cart.items.length === 0}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
