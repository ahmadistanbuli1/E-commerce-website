import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PackageOpen, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { PageLayout } from "../components/layout/PageLayout";
import { ProductCard, ProductCardSkeleton } from "../components/catalog/ProductCard";
import { CategorySelect } from "../components/ui/CategorySelect";
import { Select } from "../components/ui/Select";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { Button } from "../components/ui/Button";
import { useCategories, useProducts } from "../hooks/catalog";
import { useAddToCart } from "../hooks/cart";
import { useAuthSession } from "../hooks/auth";
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from "../hooks/wishlist";
import { useAppDispatch } from "../app/hooks";
import { setCartOpen } from "../app/features/ui/uiSlice";
import { Card } from "../components/ui/Card";
import type { ProductSort } from "../interfaces/catalog";
import { blurIn, fadeUp, staggerContainer } from "../utils/motion";

export function ProductsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryId, setCategoryId] = useState<string | undefined>(
    searchParams.get("categoryId") ?? undefined
  );
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [sort, setSort] = useState<ProductSort>(
    (searchParams.get("sort") as ProductSort) || "newest"
  );

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setCategoryId(searchParams.get("categoryId") ?? undefined);
    setSort((searchParams.get("sort") as ProductSort) || "newest");
  }, [searchParams]);

  const { isLoggedIn } = useAuthSession();
  const categoriesQuery = useCategories();
  const productsQuery = useProducts({
    page: 1,
    limit: 12,
    categoryId,
    search: search.trim() || undefined,
    sort
  });
  const addToCart = useAddToCart();
  const wishlistQuery = useWishlist(isLoggedIn);
  const addWish = useAddToWishlist();
  const removeWish = useRemoveFromWishlist();

  const categories = categoriesQuery.data ?? [];
  const products = productsQuery.data?.items ?? [];
  const wished = new Set((wishlistQuery.data ?? []).map((w) => w.product.id));

  const selectedCategoryName = useMemo(() => {
    if (!categoryId) return "All products";
    return categories.find((c) => c.id === categoryId)?.name ?? "All products";
  }, [categoryId, categories]);

  const applySearch = () => {
    const q = search.trim();
    const params: Record<string, string> = {};
    if (q) params.search = q;
    if (categoryId) params.categoryId = categoryId;
    if (sort && sort !== "newest") params.sort = sort;
    setSearchParams(params);
  };

  const handleSortChange = (value: ProductSort) => {
    setSort(value);
    const params: Record<string, string> = {};
    const q = search.trim();
    if (q) params.search = q;
    if (categoryId) params.categoryId = categoryId;
    if (value !== "newest") params.sort = value;
    setSearchParams(params);
  };

  const handleAddToCart = (productId: string) => {
    addToCart.mutate(
      { productId, quantity: 1 },
      {
        onSuccess: () => dispatch(setCartOpen(true)),
        onError: () => navigate("/login")
      }
    );
  };

  const handleToggleWishlist = (productId: string) => {
    if (wished.has(productId)) {
      removeWish.mutate(productId, { onError: () => navigate("/login") });
    } else {
      addWish.mutate(productId, { onError: () => navigate("/login") });
    }
  };

  return (
    <PageLayout>
      <motion.section
        className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-8 shadow-card sm:px-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.1, 0.05)}
      >
        <motion.div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-light blur-3xl dark:bg-primary/10"
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative">
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Curated collection
          </motion.p>
          <motion.h1 variants={blurIn} className="heading-1 mt-3">
            Shop our products
          </motion.h1>
          <motion.p variants={fadeUp} className="body-text mt-2 max-w-2xl">
            Discover quality items across categories — fast checkout, wishlist, and secure ordering.
          </motion.p>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
      <Card className="mt-8" padding="sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span>
              Showing <span className="font-semibold text-foreground">{selectedCategoryName}</span>
              {productsQuery.data ? (
                <span className="text-muted-foreground"> · {productsQuery.data.meta.total} items</span>
              ) : null}
            </span>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
            <div className="relative flex-1 sm:min-w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="input-base py-2.5 pl-10"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applySearch()}
              />
            </div>

            <div className="sm:w-56">
              <CategorySelect
                value={categoryId}
                options={categories.map((c) => ({ id: c.id, name: c.name }))}
                onChange={setCategoryId}
                placeholder="All categories"
              />
            </div>

            <div className="sm:w-48">
              <Select
                value={sort}
                onChange={(v) => handleSortChange(v as ProductSort)}
                options={[
                  { value: "newest", label: "Newest first" },
                  { value: "price_asc", label: "Price: low to high" },
                  { value: "price_desc", label: "Price: high to low" },
                  { value: "name", label: "Name A–Z" }
                ]}
              />
            </div>

            <Button variant="outline" size="sm" onClick={applySearch}>
              Search
            </Button>
          </div>
        </div>
      </Card>
      </motion.div>

      {productsQuery.isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : productsQuery.isError ? (
        <div className="mt-8">
          <ErrorState
            message="Failed to load products. Please try again later."
            onRetry={() => productsQuery.refetch()}
          />
        </div>
      ) : products.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={PackageOpen}
            title="No products found"
            description="Try adjusting your search or category filter."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategoryId(undefined);
                  setSearchParams({});
                }}
              >
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <motion.div
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.08)}
        >
          {products.map((p) => (
            <motion.div key={p.id} variants={fadeUp}>
              <ProductCard
                product={p}
                wished={wished.has(p.id)}
                addToCartPending={addToCart.isPending}
                onAddToCart={() => handleAddToCart(p.id)}
                onToggleWishlist={() => handleToggleWishlist(p.id)}
                animateOnView={false}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </PageLayout>
  );
}
