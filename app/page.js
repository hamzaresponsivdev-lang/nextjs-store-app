"use client";
import Image from "next/image";

import Link from "next/link";

import { useEffect, useState } from "react";

const fallbackImage =
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80";

function ShoppingBagIcon({ className = "size-5" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 8.25h10.5l.75 12H6l.75-12Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 8.25V6a3 3 0 0 1 6 0v2.25"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="m16 16 4 4" />
    </svg>
  );
}

function MenuIcon({ isOpen }) {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      {isOpen ? (
        <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
      ) : (
        <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 17 17 7m0 0H8m9 0v9"
      />
    </svg>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(15_23_42/0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgb(15_23_42/0.1)]">
      <div className="relative aspect-5/3 overflow-hidden bg-slate-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700 shadow-sm">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {product.title}
        </h2>
        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ${Number(product.price).toFixed(2)}
          </span>
          <Link
            href={`/checkout/${product._id}`}
            onClick={() => onAdd(product)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-sky-600 active:scale-95"
          >
            <ShoppingBagIcon className="size-4" />
            Buy Now
          </Link>
        </div>
      </div>
    </article>
  );
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="aspect-5/3 animate-pulse bg-slate-200" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-10 animate-pulse rounded bg-slate-100" />
        <div className="h-10 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product", { cache: "no-store" });
        if (!response.ok) throw new Error("Unable to load products.");
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message || "Unable to load products right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];
  const filteredProducts = products.filter((product) => {
    const searchableText = `${product.title} ${product.category}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  function addToCart() {
    setCartCount((count) => count + 1);
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#f6f8fb]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <button
              type="button"
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="mr-3 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors duration-300 hover:border-blue-300 hover:text-blue-600 md:hidden"
            >
              <MenuIcon isOpen={isMenuOpen} />
            </button>
            <a
              href="#top"
              className="mr-auto font-serif text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl md:mr-0"
            >
              The Prime Collection
            </a>
            <div className="hidden items-center gap-9 text-sm font-medium md:flex">
              <a
                className="font-medium text-slate-700 transition-colors duration-300 hover:text-blue-600"
                href="#shop"
              >
                Home
              </a>
              <a
                className="font-medium text-slate-700 transition-colors duration-300 hover:text-blue-600"
                href="#about"
              >
                About
              </a>
              <a
                className="font-medium text-slate-700 transition-colors duration-300 hover:text-blue-600"
                href="#contact"
              >
                Contact Us
              </a>
            </div>
            <button
              type="button"
              aria-label={`Shopping bag with ${cartCount} items`}
              className="relative ml-3 shrink-0 rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 transition hover:border-sky-300 hover:text-sky-600"
            >
              <ShoppingBagIcon />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          {isMenuOpen && (
            <div
              id="mobile-navigation"
              className="border-t border-slate-200 py-3 md:hidden"
            >
              <div className="flex flex-col">
                <a
                  className="rounded-md px-3 py-3 text-sm font-medium text-slate-700 transition-colors duration-300 hover:bg-blue-50 hover:text-blue-600"
                  href="#shop"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
                <a
                  className="rounded-md px-3 py-3 text-sm font-medium text-slate-700 transition-colors duration-300 hover:bg-blue-50 hover:text-blue-600"
                  href="#about"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
                <a
                  className="rounded-md px-3 py-3 text-sm font-medium text-slate-700 transition-colors duration-300 hover:bg-blue-50 hover:text-blue-600"
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section
        id="top"
        className="mx-auto max-w-7xl px-5 pb-14 pt-16 lg:px-8 lg:pb-20 lg:pt-24"
      >
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-sky-600">
            The edit / 2026
          </p>
          <h1 className="max-w-2xl font-serif text-5xl leading-[0.98] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Everyday pieces,{" "}
            <em className="font-normal text-sky-600">exceptionally</em> chosen.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
            Discover considered essentials with a little more character. Made
            for the way you move through the world.
          </p>
        </div>
        <div className="mt-10 flex max-w-2xl items-center rounded-full border border-slate-200 bg-white p-1.5 shadow-[0_8px_30px_rgb(15_23_42/0.05)] focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100">
          <SearchIcon />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search the collection..."
            aria-label="Search products by title or category"
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          <span className="hidden rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-500 sm:block">
            {products.length} pieces
          </span>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Curated for you
            </p>
            <h2 className="mt-2 font-serif text-3xl text-slate-950">
              The collection
            </h2>
          </div>
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${activeCategory === category ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-sky-50 hover:text-sky-700"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        )}
        {!isLoading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
            {error}
          </div>
        )}
        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h3 className="font-serif text-2xl text-slate-900">
              Nothing matched that search.
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try another title, category, or clear your filters.
            </p>
          </div>
        )}
        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.title}
                product={product}
                onAdd={addToCart}
              />
            ))}
          </div>
        )}
      </section>

      <footer id="about" className="bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <a
              href="#top"
              className="font-serif text-2xl font-semibold text-white"
            >
              The Prime Collection
            </a>
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              A thoughtful wardrobe of well-made essentials, distinctive
              details, and pieces that stay with you.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Explore
            </h3>
            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <a className="block transition hover:text-white" href="#shop">
                Home
              </a>
              <a className="block transition hover:text-white" href="#about">
                About
              </a>
              <a className="block transition hover:text-white" href="#contact">
                Contact
              </a>
              <a className="block transition hover:text-white" href="#terms">
                Terms of Service
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Need a hand?
            </h3>
            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <a className="block transition hover:text-white" href="#shipping">
                Shipping Policy
              </a>
              <a className="block transition hover:text-white" href="#returns">
                Returns
              </a>
              <a className="block transition hover:text-white" href="#faq">
                FAQ
              </a>
            </div>
          </div>
          <div id="contact">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Stay in the loop
            </h3>
            <p className="mt-5 text-sm leading-6 text-slate-400">
              New drops and good things, sent sparingly.
            </p>
            <form
              className="mt-5 flex border-b border-slate-700 pb-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                aria-label="Email address"
                type="email"
                required
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-sky-400 transition hover:text-white"
              >
                Subscribe <ArrowUpRightIcon />
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-slate-800 px-5 py-6 text-center text-xs text-slate-500">
          © 2026 The Prime Collection. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
