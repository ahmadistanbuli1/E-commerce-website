import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-slate-900">
            E-Commerce
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Login
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h1 className="text-2xl font-bold text-slate-900">Project Skeleton</h1>
          <p className="mt-2 text-slate-600">
            Frontend is ready (Router/Providers/Tailwind). Next phases will add
            catalog, cart, wishlist, and orders.
          </p>
        </div>
      </main>
    </div>
  );
}

