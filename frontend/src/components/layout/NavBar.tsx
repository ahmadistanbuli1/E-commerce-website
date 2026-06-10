import { Link, useNavigate, useLocation } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

import { BarChart3, ChevronDown, Heart, LogOut, Search, ShoppingCart, Store, User } from "lucide-react";

import { Menu } from "@headlessui/react";

import { useLogoutAndRedirect, useAuthSession } from "../../hooks/auth";

import { useCart } from "../../hooks/cart";

import { useMemo, useState, useEffect, FormEvent } from "react";

import { useAppDispatch } from "../../app/hooks";

import { setCartOpen } from "../../app/features/ui/uiSlice";

import { cn } from "../../utils/cn";

import { springSnappy, tapPress } from "../../utils/motion";



type NavBarVariant = "default" | "floating";



function NavLink({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {

  return (

    <motion.div whileHover={{ y: -1 }} whileTap={tapPress}>

      <Link

        to={to}

        className={cn(

          "inline-flex rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20",

          className

        )}

      >

        {children}

      </Link>

    </motion.div>

  );

}



export function NavBar({ variant = "default" }: { variant?: NavBarVariant }) {

  const { user, isLoggedIn } = useAuthSession();
  const logoutAndRedirect = useLogoutAndRedirect();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const cartQuery = useCart(isLoggedIn);

  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const isFloating = variant === "floating";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") ?? "");
  }, [location.search]);



  useEffect(() => {

    if (!isFloating) return;



    const onScroll = () => setScrolled(window.scrollY > 20);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);

  }, [isFloating]);



  const count = useMemo(() => {

    const cart = cartQuery.data;

    if (!cart) return 0;

    return cart.items.reduce((acc, it) => acc + it.quantity, 0);

  }, [cartQuery.data]);



  const handleSearch = (e: FormEvent) => {

    e.preventDefault();

    const q = search.trim();

    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");

  };



  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "?";



  return (

    <motion.div

      className={cn("z-40", isFloating ? "fixed inset-x-0 top-0" : "sticky top-0")}

      initial={isFloating ? { opacity: 0, y: -16 } : false}

      animate={{

        opacity: 1,

        y: 0,

        paddingTop: isFloating ? (scrolled ? 0 : 16) : 0,

        paddingLeft: isFloating ? (scrolled ? 0 : 16) : 0,

        paddingRight: isFloating ? (scrolled ? 0 : 16) : 0

      }}

      transition={springSnappy}

    >

      <motion.header

        animate={

          isFloating

            ? {

                borderRadius: scrolled ? 0 : 16,

                boxShadow: scrolled

                  ? "0 1px 3px rgba(15,23,42,0.08)"

                  : "0 10px 40px rgba(15,23,42,0.08)"

              }

            : undefined

        }

        transition={springSnappy}

        className={cn(

          isFloating

            ? "mx-auto max-w-7xl border border-white/50 bg-white/70 backdrop-blur-xl"

            : "border-b border-slate-200 bg-white/90 backdrop-blur-md"

        )}

      >

        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">

          <motion.div whileHover={{ scale: 1.02 }} whileTap={tapPress}>

            <Link to="/" className="inline-flex shrink-0 items-center gap-2 font-bold text-slate-900">

              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">

                <Store className="h-4 w-4" />

              </span>

              <span className="hidden text-lg sm:inline">E-Commerce</span>

            </Link>

          </motion.div>



          <form onSubmit={handleSearch} className="hidden flex-1 md:block md:max-w-md lg:max-w-lg">

            <div className="relative">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input

                className="input-base border-white/60 bg-white/80 py-2 pl-10 backdrop-blur-sm"

                placeholder="Search products..."

                value={search}

                onChange={(e) => setSearch(e.target.value)}

              />

            </div>

          </form>



          <nav className="ml-auto flex items-center gap-2">

            <NavLink to="/products" className="hidden sm:inline-flex">

              Products

            </NavLink>



            {isLoggedIn ? (
              <NavLink to="/wishlist" className="hidden items-center gap-1.5 sm:inline-flex">
                <Heart className="h-4 w-4 text-red-500" />
                Wishlist
              </NavLink>
            ) : null}



            {isLoggedIn ? (
              <motion.button
                type="button"
                onClick={() => dispatch(setCartOpen(true))}
                whileHover={{ scale: 1.03 }}
                whileTap={tapPress}
                className="relative inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Cart</span>
                <AnimatePresence mode="popLayout">
                  {count > 0 ? (
                    <motion.span
                      key={count}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white"
                    >
                      {count > 99 ? "99+" : count}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </motion.button>
            ) : null}



            {user?.role === "ADMIN" ? (

              <NavLink to="/admin" className="hidden items-center gap-1.5 lg:inline-flex">

                <BarChart3 className="h-4 w-4 text-blue-600" />

                Admin

              </NavLink>

            ) : null}



            {user ? (

              <Menu as="div" className="relative">

                <Menu.Button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20">

                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white">

                    {initials}

                  </span>

                  <span className="hidden max-w-[6rem] truncate lg:inline">{user.firstName}</span>

                  <ChevronDown className="h-4 w-4 text-slate-400" />

                </Menu.Button>



                <Menu.Items className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-slate-100 bg-white p-1 shadow-lg focus:outline-none">

                  <div className="border-b border-slate-100 px-3 py-2">

                    <p className="truncate text-sm font-semibold text-slate-800">

                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>

                  </div>

                  <Menu.Item>

                    {({ active }) => (

                      <Link

                        to="/orders"

                        className={cn(

                          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",

                          active ? "bg-slate-50 text-slate-900" : "text-slate-700"

                        )}

                      >

                        <User className="h-4 w-4" />

                        My orders

                      </Link>

                    )}

                  </Menu.Item>

                  <Menu.Item>

                    {({ active }) => (

                      <button

                        type="button"

                        onClick={logoutAndRedirect}

                        className={cn(

                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm",

                          active ? "bg-slate-50 text-slate-900" : "text-slate-700"

                        )}

                      >

                        <LogOut className="h-4 w-4" />

                        Logout

                      </button>

                    )}

                  </Menu.Item>

                </Menu.Items>

              </Menu>

            ) : (

              <NavLink to="/login">Login</NavLink>

            )}

          </nav>

        </div>



        <form onSubmit={handleSearch} className="border-t border-slate-100/80 px-4 py-2 md:hidden">

          <div className="relative">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input

              className="input-base border-white/60 bg-white/80 py-2 pl-10 backdrop-blur-sm"

              placeholder="Search products..."

              value={search}

              onChange={(e) => setSearch(e.target.value)}

            />

          </div>

        </form>

      </motion.header>

    </motion.div>

  );

}

