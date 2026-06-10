import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Package, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { PageLayout } from "../components/layout/PageLayout";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { ProductPrice, NewBadge } from "../components/catalog/ProductPrice";
import { ProductRating, StarRatingInput } from "../components/catalog/ProductRating";
import { QuantityControl } from "../components/ui/QuantityControl";
import { InlineError } from "../components/ui/ErrorState";
import { Skeleton } from "../components/ui/LoadingState";
import { useProduct, useMyProductReview, useSubmitProductReview } from "../hooks/catalog";
import { useMe } from "../hooks/auth";
import { useAddToCart } from "../hooks/cart";
import { WishlistButton } from "../components/ui/WishlistButton";
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from "../hooks/wishlist";
import { useAppDispatch } from "../app/hooks";
import { setCartOpen } from "../app/features/ui/uiSlice";
import { resolveImageUrl } from "../utils/media";
import {
  fadeUp,
  imageReveal,
  slideInLeft,
  slideInRight,
  staggerContainer,
  tapPress,
  viewportOnce
} from "../utils/motion";

function ProductDetailsSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-48" />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24" />
          <Skeleton className="h-12" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailsPage() {
  const { id } = useParams();
  const productQuery = useProduct(id ?? "");
  const addToCart = useAddToCart();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const me = useMe();
  const wishlistQuery = useWishlist(Boolean(me.data));
  const addWish = useAddToWishlist();
  const removeWish = useRemoveFromWishlist();
  const myReviewQuery = useMyProductReview(id ?? "", Boolean(me.data));
  const submitReview = useSubmitProductReview();
  const [quantity, setQuantity] = useState(1);
  const [ratingScore, setRatingScore] = useState(0);

  useEffect(() => {
    if (myReviewQuery.data?.score) {
      setRatingScore(myReviewQuery.data.score);
    }
  }, [myReviewQuery.data?.score]);

  if (productQuery.isLoading) {
    return (
      <PageLayout>
        <ProductDetailsSkeleton />
      </PageLayout>
    );
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <PageLayout className="py-16 text-center">
        <InlineError>Product not found.</InlineError>
        <Link to="/products" className="mt-4 inline-block">
          <Button variant="outline">Back to products</Button>
        </Link>
      </PageLayout>
    );
  }

  const p = productQuery.data;
  const wished = new Set((wishlistQuery.data ?? []).map((w) => w.product.id));
  const outOfStock = p.stock <= 0;
  const lowStock = !outOfStock && p.stock <= 5;

  const activeRating = ratingScore || myReviewQuery.data?.score || 0;

  return (
    <PageLayout className="py-6 sm:py-10">
      <motion.nav
        className="flex flex-wrap items-center gap-1 text-sm text-slate-500"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="transition-colors hover:text-blue-600">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/products" className="transition-colors hover:text-blue-600">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-600">{p.category.name}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="line-clamp-1 font-medium text-slate-800">{p.name}</span>
      </motion.nav>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <motion.div
          className="relative"
          initial="hidden"
          animate="visible"
          variants={slideInLeft}
        >
          <Card padding="sm" className="overflow-hidden">
            <motion.div className="aspect-square overflow-hidden rounded-2xl bg-slate-50" variants={imageReveal}>
              <motion.img
                className="h-full w-full object-cover"
                src={resolveImageUrl(p.imageUrl)}
                alt={p.name}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </Card>

          <motion.div
            className="mt-4 grid grid-cols-3 gap-3"
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: Truck, label: "Fast delivery" },
              { icon: ShieldCheck, label: "Secure checkout" },
              { icon: RotateCcw, label: "Easy returns" }
            ].map(({ icon: Icon, label }) => (
              <motion.div key={label} variants={fadeUp} whileHover={{ y: -3 }}>
                <Card padding="sm" className="flex flex-col items-center gap-2 text-center">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="text-[11px] font-medium leading-tight text-slate-600">{label}</span>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:sticky lg:top-24 lg:self-start"
          initial="hidden"
          animate="visible"
          variants={slideInRight}
        >
          <Card padding="lg">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">{p.category.name}</Badge>
              {p.isNew ? <NewBadge /> : null}
            </div>

            <h1 className="heading-2 mt-4">{p.name}</h1>

            <ProductRating
              rating={p.averageRating}
              count={p.ratingCount}
              size="md"
              className="mt-3"
            />

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <ProductPrice
                price={p.price}
                compareAtPrice={p.compareAtPrice}
                discountPercent={p.discountPercent}
                size="lg"
              />
              {outOfStock ? (
                <Badge variant="neutral">Out of stock</Badge>
              ) : lowStock ? (
                <Badge variant="warning">Only {p.stock} left</Badge>
              ) : (
                <Badge variant="success">In stock</Badge>
              )}
            </div>

            <p className="body-text mt-5">{p.description}</p>

            {me.data ? (
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  {myReviewQuery.data ? "Update your rating" : "Rate this product"}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <StarRatingInput
                    value={activeRating}
                    onChange={setRatingScore}
                    disabled={submitReview.isPending}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={activeRating === 0 || submitReview.isPending}
                    onClick={() =>
                      submitReview.mutate({ productId: p.id, score: activeRating })
                    }
                  >
                    {myReviewQuery.data ? "Update" : "Submit"}
                  </Button>
                </div>
              </div>
            ) : null}

            <motion.div
              className="mt-8 space-y-4"
              initial="hidden"
              animate="visible"
              variants={staggerContainer(0.1, 0.3)}
            >
              {!outOfStock ? (
                <motion.div variants={fadeUp} className="flex items-center gap-4">
                  <span className="label-text">Quantity</span>
                  <QuantityControl
                    value={quantity}
                    min={1}
                    max={p.stock}
                    onChange={setQuantity}
                  />
                  <span className="text-xs text-slate-400">{p.stock} available</span>
                </motion.div>
              ) : null}

              <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
                <motion.div className="flex-1" whileHover={{ scale: 1.01 }} whileTap={tapPress}>
                  <Button
                    fullWidth
                    size="lg"
                    className="flex-1"
                    disabled={addToCart.isPending || outOfStock}
                    onClick={() =>
                      addToCart.mutate(
                        { productId: p.id, quantity },
                        {
                          onSuccess: () => dispatch(setCartOpen(true)),
                          onError: () => navigate("/login")
                        }
                      )
                    }
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {outOfStock ? "Out of stock" : "Add to cart"}
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={tapPress}>
                  <WishlistButton
                    className="px-4 py-3.5 sm:min-w-[3.25rem]"
                    active={wished.has(p.id)}
                    onClick={() => {
                      if (wished.has(p.id)) {
                        removeWish.mutate(p.id, { onError: () => navigate("/login") });
                      } else {
                        addWish.mutate(p.id, { onError: () => navigate("/login") });
                      }
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <Package className="h-5 w-5 shrink-0 text-slate-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">SKU</p>
                  <p className="text-xs text-slate-500">{p.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <Package className="h-5 w-5 shrink-0 text-slate-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Category</p>
                  <p className="text-xs text-slate-500">{p.category.name}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
      >
        <Card className="mt-10" padding="lg">
          <h2 className="heading-3">Product details</h2>
          <p className="body-text mt-4 max-w-3xl">{p.description}</p>
          <motion.ul
            className="mt-6 grid gap-3 sm:grid-cols-2"
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {[
              "Premium quality materials",
              "Carefully packed for delivery",
              "Customer support available",
              "Secure payment processing"
            ].map((item) => (
              <motion.li key={item} variants={fadeUp} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </Card>
      </motion.div>
    </PageLayout>
  );
}
