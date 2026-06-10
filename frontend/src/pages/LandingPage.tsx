import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Headphones,
  Package,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Users
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { NavBar } from "../components/layout/NavBar";
import { Button } from "../components/ui/Button";
import { ProductCard, ProductCardSkeleton } from "../components/catalog/ProductCard";
import { useCategories, useProducts } from "../hooks/catalog";
import { useAddToCart } from "../hooks/cart";
import { useAuthSession } from "../hooks/auth";
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from "../hooks/wishlist";
import { useAppDispatch } from "../app/hooks";
import { setCartOpen } from "../app/features/ui/uiSlice";
import {
  fadeUp,
  hoverLift,
  scaleIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  tapPress,
  viewportOnce
} from "../utils/motion";

const perks = [
  { Icon: Truck, title: "Free shipping", desc: "On orders over $50" },
  { Icon: RefreshCw, title: "Easy returns", desc: "30-day hassle-free policy" },
  { Icon: ShieldCheck, title: "Secure checkout", desc: "Encrypted payments" },
  { Icon: Headphones, title: "24/7 support", desc: "We're here to help" }
];

const categoryVisuals = [
  "from-violet-500 to-purple-700",
  "from-blue-500 to-cyan-600",
  "from-rose-500 to-orange-500",
  "from-emerald-500 to-teal-600"
];

const stats = [
  { value: "50K+", label: "Happy customers" },
  { value: "2K+", label: "Products" },
  { value: "99%", label: "Satisfaction rate" },
  { value: "24h", label: "Fast dispatch" }
];

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=750&fit=crop",
    alt: "Fashion collection",
    className: "aspect-[4/5]",
    label: "New arrivals"
  },
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    alt: "Premium headphones",
    className: "aspect-square",
    label: null
  },
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=625&fit=crop",
    alt: "Accessories",
    className: "aspect-[4/5]",
    label: "Best sellers"
  }
];

function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer(0.1)}
    >
      <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-blue-600">
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p variants={fadeUp} className="mt-2 max-w-lg text-muted-foreground">
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAuthSession();
  const categoriesQuery = useCategories();
  const productsQuery = useProducts({ page: 1, limit: 4 });
  const addToCart = useAddToCart();
  const wishlistQuery = useWishlist(isLoggedIn);
  const addWish = useAddToWishlist();
  const removeWish = useRemoveFromWishlist();

  const categories = categoriesQuery.data ?? [];
  const products = productsQuery.data?.items ?? [];
  const wished = useMemo(
    () => new Set((wishlistQuery.data ?? []).map((w) => w.product.id)),
    [wishlistQuery.data]
  );

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

  const displayCategories =
    categories.length > 0
      ? categories.slice(0, 4)
      : [
          { id: "1", name: "Electronics" },
          { id: "2", name: "Fashion" },
          { id: "3", name: "Home" },
          { id: "4", name: "Sports" }
        ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar variant="floating" />

      <main className="pt-24 sm:pt-28">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/80 via-background to-background dark:from-blue-950/40 dark:via-background dark:to-background" />
          <motion.div
            className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-600/15"
            animate={{ y: [0, -18, 0], x: [0, 12, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-600/10"
            animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-8 lg:grid-cols-2 lg:gap-16 lg:px-6 lg:pb-28 lg:pt-12">
            <motion.div
              className="max-w-xl"
              initial="hidden"
              animate="visible"
              variants={staggerContainer(0.12, 0.15)}
            >
              <motion.p
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur-sm"
              >
                <motion.span
                  animate={{ rotate: [0, 12, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </motion.span>
                New season collection
              </motion.p>

              <motion.h1
                variants={fadeUp}
                className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              >
                Style that moves
                <motion.span
                  className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                >
                  with you.
                </motion.span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Discover curated essentials, limited drops, and everyday favorites — crafted for a seamless shopping
                experience from browse to checkout.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={tapPress}>
                  <Link to="/products">
                    <Button size="lg" className="gap-2 px-8">
                      Shop now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={tapPress}>
                  <Link to="/register">
                    <Button variant="outline" size="lg" className="bg-card/80 backdrop-blur-sm">
                      Join for free
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -30 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.7 + i * 0.08, type: "spring", stiffness: 320, damping: 18 }}
                    >
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </motion.span>
                  ))}
                  <span className="ml-2 font-medium text-foreground">4.9</span>
                  <span className="text-muted-foreground">from 12k+ reviews</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative mx-auto w-full max-w-lg lg:max-w-none"
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3 sm:space-y-4">
                  <motion.div
                    className="group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl shadow-black/10 dark:shadow-black/40"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    whileHover={{ y: -4 }}
                  >
                    <img
                      src={heroImages[0].src}
                      alt={heroImages[0].alt}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                    <p className="absolute bottom-4 left-4 text-sm font-semibold text-white">New arrivals</p>
                  </motion.div>

                  <motion.div
                    className="rounded-2xl border border-white/60 bg-card/70 p-4 shadow-lg backdrop-blur-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="text-2xl font-bold text-foreground">Up to 40%</p>
                    <p className="mt-1 text-sm text-muted-foreground">Seasonal sale on selected items</p>
                  </motion.div>
                </div>

                <div className="space-y-3 pt-8 sm:space-y-4 sm:pt-12">
                  {heroImages.slice(1).map((img, idx) => (
                    <motion.div
                      key={img.src}
                      className={`group relative overflow-hidden rounded-3xl shadow-xl shadow-black/10 dark:shadow-black/40 ${img.className}`}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 + idx * 0.15, duration: 0.6 }}
                      whileHover={{ y: -4 }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      {img.label ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                          <p className="absolute bottom-4 left-4 text-sm font-semibold text-white">{img.label}</p>
                        </>
                      ) : null}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Perks */}
        <section className="border-y border-border bg-card">
          <motion.div
            className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 lg:px-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.1)}
          >
            {perks.map(({ Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <motion.span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light text-primary dark:bg-primary/15"
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.span>
                <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow="Collections" title="Shop by category" />
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.12)}
          >
            {displayCategories.map((cat, idx) => (
              <motion.div key={cat.id} variants={scaleIn} whileHover={hoverLift} whileTap={tapPress}>
                <Link
                  to={categories.length > 0 ? `/products?categoryId=${cat.id}` : "/products"}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-3xl shadow-md"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${categoryVisuals[idx % categoryVisuals.length]} opacity-90 transition duration-300 group-hover:opacity-100`}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <p className="text-lg font-bold text-white sm:text-xl">{cat.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-white/80 opacity-0 transition duration-300 group-hover:opacity-100">
                      Explore
                      <ArrowRight className="h-3.5 w-3.5" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Trending */}
        <section className="bg-card py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeader
                eyebrow="Trending now"
                title="Popular picks"
                description="Handpicked products our customers love right now."
              />
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: 0.25 }}
              >
                <Link to="/products">
                  <Button variant="outline">Browse catalog</Button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer(0.1)}
            >
              {productsQuery.isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <motion.div key={i} variants={fadeUp}>
                      <ProductCardSkeleton />
                    </motion.div>
                  ))
                : products.map((product) => (
                    <motion.div key={product.id} variants={fadeUp}>
                      <ProductCard
                        product={product}
                        wished={wished.has(product.id)}
                        onAddToCart={() => handleAddToCart(product.id)}
                        onToggleWishlist={() => handleToggleWishlist(product.id)}
                        addToCartPending={addToCart.isPending}
                        animateOnView={false}
                      />
                    </motion.div>
                  ))}
            </motion.div>
          </div>
        </section>

        {/* Promo banner */}
        <section className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-zinc-900 px-8 py-14 dark:bg-zinc-950 sm:px-12 sm:py-16"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <motion.div
                className="max-w-xl"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={staggerContainer(0.1)}
              >
                <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                  Limited time
                </motion.p>
                <motion.h3 variants={fadeUp} className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Summer essentials — up to 40% off
                </motion.h3>
                <motion.p variants={fadeUp} className="mt-3 text-white/70">
                  Refresh your wardrobe and home with exclusive deals. Free shipping on qualifying orders.
                </motion.p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={tapPress}>
                <Link to="/products">
                  <Button size="lg" className="shrink-0 bg-card text-foreground hover:bg-card/90">
                    Shop the sale
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* About us */}
        <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={slideInLeft}
            >
              <motion.div
                className="overflow-hidden rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/40"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop"
                  alt="Our team at work"
                  className="aspect-[4/3] w-full object-cover"
                />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -right-4 rounded-2xl border border-white/60 bg-card/90 p-5 shadow-xl backdrop-blur-md sm:-right-6"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={viewportOnce}
                transition={{ delay: 0.3, type: "spring", stiffness: 280, damping: 20 }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Award className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">Trusted since 2020</p>
                    <p className="text-xs text-muted-foreground">Quality-first e-commerce</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={slideInRight}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">About us</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built for people who expect more from online shopping
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                We combine thoughtful curation, fast fulfillment, and a frictionless checkout so you can focus on
                finding products you love — not fighting the interface.
              </p>

              <motion.div
                className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
                variants={staggerContainer(0.08)}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
              >
                {stats.map((s) => (
                  <motion.div
                    key={s.label}
                    variants={scaleIn}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="mt-8 grid gap-4 sm:grid-cols-2"
                variants={staggerContainer(0.12)}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
              >
                <motion.div variants={fadeUp} whileHover={{ x: 4 }} className="flex gap-3 rounded-2xl bg-muted/80 p-4">
                  <Users className="h-5 w-5 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Customer-first</p>
                    <p className="mt-1 text-sm text-muted-foreground">Every decision starts with your experience.</p>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} whileHover={{ x: 4 }} className="flex gap-3 rounded-2xl bg-muted/80 p-4">
                  <Package className="h-5 w-5 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Quality assured</p>
                    <p className="mt-1 text-sm text-muted-foreground">Curated products from trusted suppliers.</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="border-t border-border bg-card py-16">
          <motion.div
            className="mx-auto max-w-2xl px-4 text-center lg:px-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.12)}
          >
            <motion.h3 variants={fadeUp} className="text-2xl font-bold text-foreground">
              Stay in the loop
            </motion.h3>
            <motion.p variants={fadeUp} className="mt-2 text-muted-foreground">
              Get early access to drops, sales, and style inspiration.
            </motion.p>
            <motion.form
              variants={fadeUp}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <motion.input
                type="email"
                placeholder="Enter your email"
                className="input-base max-w-sm flex-1 sm:min-w-[280px]"
                whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(59,130,246,0.15)" }}
              />
              <motion.div whileHover={{ scale: 1.03 }} whileTap={tapPress}>
                <Button type="submit" className="shrink-0">
                  Subscribe
                </Button>
              </motion.div>
            </motion.form>
          </motion.div>
        </section>

        {/* Footer */}
        <motion.footer
          className="border-t border-border bg-zinc-900 px-4 py-12 text-zinc-400 lg:px-6 dark:bg-zinc-950"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm">© {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              {[
                { to: "/products", label: "Shop" },
                { to: "/register", label: "Register" },
                { to: "/login", label: "Login" }
              ].map((link) => (
                <motion.div key={link.to} whileHover={{ y: -2, color: "#fff" }}>
                  <Link to={link.to} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
