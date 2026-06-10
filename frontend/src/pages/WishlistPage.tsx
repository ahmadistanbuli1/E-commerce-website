import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { PageLayout } from "../components/layout/PageLayout";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { ProductPrice } from "../components/catalog/ProductPrice";
import { useWishlist, useRemoveFromWishlist } from "../hooks/wishlist";
import { useAddToCart } from "../hooks/cart";
import { useAppDispatch } from "../app/hooks";
import { setCartOpen } from "../app/features/ui/uiSlice";
import { fadeUp, hoverLift, staggerContainer, tapPress } from "../utils/motion";
import { resolveImageUrl } from "../utils/media";

export function WishlistPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wishlistQuery = useWishlist();
  const remove = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const items = wishlistQuery.data ?? [];

  return (
    <PageLayout>
      <PageHeader
        title="Wishlist"
        description="Products you've saved for later."
        action={
          <Button variant="outline" onClick={() => navigate("/products")}>
            Browse products
          </Button>
        }
      />

      {wishlistQuery.isLoading ? (
        <LoadingState message="Loading wishlist..." />
      ) : wishlistQuery.isError ? (
        <ErrorState
          message="Failed to load your wishlist."
          onRetry={() => wishlistQuery.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save products you love and come back to them anytime."
          action={<Button onClick={() => navigate("/products")}>Discover products</Button>}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.1)}
        >
          {items.map((it) => (
            <motion.div key={it.id} variants={fadeUp} whileHover={hoverLift} whileTap={tapPress}>
            <Card hover padding="none" className="overflow-hidden">
              <div className="aspect-square overflow-hidden bg-muted">
                <motion.img
                  className="h-full w-full object-cover"
                  src={resolveImageUrl(it.product.imageUrl)}
                  alt={it.product.name}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {it.product.category.name}
                </p>
                <h2 className="mt-1 font-semibold text-foreground">{it.product.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{it.product.description}</p>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <ProductPrice
                    price={it.product.price}
                    compareAtPrice={it.product.compareAtPrice}
                    discountPercent={it.product.discountPercent}
                    size="md"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/products/${it.product.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      disabled={addToCart.isPending || it.product.stock <= 0}
                      onClick={() =>
                        addToCart.mutate(
                          { productId: it.product.id, quantity: 1 },
                          {
                            onSuccess: () => dispatch(setCartOpen(true)),
                            onError: () => navigate("/login")
                          }
                        )
                      }
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove.mutate(it.product.id)}
                      disabled={remove.isPending}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </PageLayout>
  );
}
