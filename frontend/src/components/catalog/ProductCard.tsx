import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import type { Product } from "../../interfaces/catalog";
import { WishlistButton } from "../ui/WishlistButton";
import { DiscountBadge, NewBadge, ProductPrice } from "./ProductPrice";
import { ProductRating } from "./ProductRating";
import { ProductImage } from "../ui/ProductImage";
import { cn } from "../../utils/cn";
import { fadeUp, hoverLift, tapPress, viewportOnce } from "../../utils/motion";

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="aspect-square bg-slate-100" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-16 rounded bg-slate-100" />
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-2/3 rounded bg-slate-100" />
        <div className="h-5 w-20 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export function ProductCard({
  product,
  wished,
  onAddToCart,
  onToggleWishlist,
  addToCartPending,
  animateOnView = true
}: {
  product: Product;
  wished: boolean;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  addToCartPending?: boolean;
  animateOnView?: boolean;
}) {
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;

  return (
    <motion.article
      initial={animateOnView ? "hidden" : false}
      whileInView={animateOnView ? "visible" : undefined}
      viewport={viewportOnce}
      variants={fadeUp}
      whileHover={!outOfStock ? hoverLift : undefined}
      whileTap={!outOfStock ? tapPress : undefined}
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm",
        outOfStock ? "cursor-not-allowed opacity-50" : "group hover:shadow-lg hover:shadow-slate-200/60"
      )}
    >
      <Link
        to={outOfStock ? "#" : `/products/${product.id}`}
        className={cn("relative block overflow-hidden", outOfStock && "pointer-events-none")}
        onClick={outOfStock ? (e) => e.preventDefault() : undefined}
      >
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          <ProductImage
            alt={product.name}
            className={cn(
              "h-full w-full object-cover",
              !outOfStock && "transition-transform duration-500 group-hover:scale-105"
            )}
            src={product.imageUrl}
          />

          {outOfStock ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <span className="rounded-full bg-slate-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                Sold out
              </span>
            </div>
          ) : null}

          {!outOfStock ? (
            <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
              {product.isNew ? <NewBadge /> : null}
              <DiscountBadge discountPercent={product.discountPercent} />
              {lowStock && !product.isNew ? (
                <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                  Only {product.stock} left
                </span>
              ) : null}
            </div>
          ) : null}

          {!outOfStock && lowStock && product.isNew ? (
            <span className="absolute bottom-3 left-3 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Only {product.stock} left
            </span>
          ) : null}

          {!outOfStock ? (
            <div
              className="absolute right-3 top-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <WishlistButton active={wished} onClick={onToggleWishlist} />
            </div>
          ) : null}

          {!outOfStock ? (
            <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
              <button
                type="button"
                disabled={addToCartPending}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900/90 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-slate-900 disabled:opacity-60"
              >
                <ShoppingBag className="h-4 w-4" />
                Quick add
              </button>
            </div>
          ) : null}
        </div>
      </Link>

      <div className={cn("flex flex-1 flex-col p-4", outOfStock && "pointer-events-none")}>
        <Link
          to={outOfStock ? "#" : `/products/${product.id}`}
          className={cn("flex-1", outOfStock && "pointer-events-none")}
          onClick={outOfStock ? (e) => e.preventDefault() : undefined}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {product.category.name}
          </p>
          <h2
            className={cn(
              "mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900",
              !outOfStock && "transition-colors group-hover:text-blue-700"
            )}
          >
            {product.name}
          </h2>
          {(product.ratingCount ?? 0) > 0 || product.averageRating ? (
            <ProductRating
              rating={product.averageRating}
              count={product.ratingCount}
              size="sm"
              className="mt-2"
            />
          ) : null}
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {product.description}
          </p>
        </Link>

        <div className="mt-4 flex items-end justify-between gap-2 border-t border-slate-50 pt-3">
          <div>
            <ProductPrice
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              discountPercent={product.discountPercent}
              size="md"
              showDiscountBadge={false}
            />
            {!outOfStock ? (
              <p className="text-[11px] text-emerald-600">In stock</p>
            ) : (
              <p className="text-[11px] text-slate-400">Unavailable</p>
            )}
          </div>

          {!outOfStock ? (
            <div className="flex items-center gap-1.5 sm:hidden">
              <WishlistButton active={wished} onClick={onToggleWishlist} />
              <button
                type="button"
                disabled={addToCartPending}
                onClick={onAddToCart}
                className="rounded-lg bg-blue-600 p-2 text-white disabled:opacity-60"
                aria-label="Add to cart"
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
