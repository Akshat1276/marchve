"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brand } from "@/content/copy";
import { BrandName } from "@/components/ui/BrandName";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchCollections, setSearchCollections] = useState<
    {
      handle: string;
      title: string;
      products: { handle: string; title: string }[];
    }[]
  >([]);
  const [expandedCollection, setExpandedCollection] = useState<string | null>(
    null
  );
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setQuery("");
  }, [pathname]);
  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 0);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);
  useEffect(() => {
    if (!searchOpen) return;
    let active = true;
    fetch("/api/search-index", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setSearchCollections(data.collections ?? []);
      })
      .catch(() => {
        if (!active) return;
        setSearchCollections([]);
      });
    return () => {
      active = false;
    };
  }, [searchOpen]);

  const dark = false;
  const q = query.trim().toLowerCase();

  const filteredCollections = useMemo(() => {
    if (!q) return searchCollections;

    return searchCollections
      .map((collection) => {
        const titleMatches = collection.title.toLowerCase().includes(q);
        const matchingProducts = collection.products.filter((p) =>
          p.title.toLowerCase().includes(q)
        );

        if (titleMatches) return collection;
        if (matchingProducts.length === 0) return null;

        return { ...collection, products: matchingProducts };
      })
      .filter(Boolean) as typeof searchCollections;
  }, [q, searchCollections]);

  useEffect(() => {
    if (!searchOpen) {
      setExpandedCollection(null);
      return;
    }
    if (!q) {
      setExpandedCollection(null);
      return;
    }
    setExpandedCollection(filteredCollections[0]?.handle ?? null);
  }, [searchOpen, q, filteredCollections]);

  const toggleCollection = (handle: string) => {
    setExpandedCollection((current) => (current === handle ? null : handle));
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          !scrolled && !open
            ? "border-transparent bg-transparent backdrop-blur-none text-primary"
            : dark
              ? "border-white/10 bg-hero-ink/80 backdrop-blur-xl text-white"
              : "border-outline-variant/30 bg-background/90 backdrop-blur-xl text-primary"
        )}
      >
        <div className="relative flex h-20 items-center justify-between px-margin-mobile md:px-margin-desktop">
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-active={pathname.startsWith(item.href)}
                className={cn(
                  "nav-link-hover font-label-caps transition-colors duration-400",
                  dark
                    ? "text-white/70 hover:text-white"
                    : "text-on-surface-variant hover:text-primary",
                  pathname.startsWith(item.href) &&
                    (dark ? "text-white" : "text-primary")
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 max-md:scale-[0.72] md:scale-100"
          >
            <BrandName />
          </Link>

          <div className="flex items-center gap-4 md:gap-5">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search products"
              className={cn(
                "inline-flex h-6 w-6 items-center justify-center text-on-surface-variant transition-colors hover:text-primary"
              )}
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <Link
              href="/cart"
              aria-label="Shopping bag"
              className={cn(
                "relative inline-flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-70",
                dark ? "text-white" : "text-on-surface-variant"
              )}
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {mounted && itemCount > 0 && (
                <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center bg-primary px-1 font-data-mono text-[10px] text-on-primary">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 top-20 z-[55] mx-auto w-[min(92vw,720px)] border border-outline-variant/30 bg-background/95 p-4 backdrop-blur-xl"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search collections or product names…"
              className="w-full border-b border-outline-variant/30 bg-transparent px-1 pb-3 pt-1 font-body-main text-primary placeholder:text-on-surface-variant/60 focus:outline-none"
            />
            <div className="scroll-y-minimal mt-4 max-h-[min(60vh,420px)] overflow-y-auto pr-1">
              <div className="divide-y divide-outline-variant/20 border-t border-outline-variant/20">
                {filteredCollections.map((collection) => {
                  const expanded = expandedCollection === collection.handle;

                  return (
                    <div key={collection.handle}>
                      <div className="flex items-center justify-between gap-4 py-4">
                        <Link
                          href={`/shop/${collection.handle}`}
                          className="font-label-caps text-primary transition-colors hover:text-secondary"
                        >
                          {collection.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleCollection(collection.handle)}
                          aria-expanded={expanded}
                          aria-label={`${expanded ? "Hide" : "Show"} ${collection.title} products`}
                          className="inline-flex h-8 w-8 items-center justify-center text-on-surface-variant transition-colors hover:text-primary"
                        >
                          <span className="material-symbols-outlined">
                            {expanded ? "expand_less" : "expand_more"}
                          </span>
                        </button>
                      </div>
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 0.9, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-2 pb-4 pl-2">
                              {collection.products.map((product) => (
                                <Link
                                  key={product.handle}
                                  href={`/product/${product.handle}`}
                                  className="block font-body-small text-on-surface-variant transition-colors hover:text-primary"
                                >
                                  {product.title}
                                </Link>
                              ))}
                              {collection.products.length === 0 && (
                                <p className="font-body-small text-on-surface-variant">
                                  No products in this collection
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
              {filteredCollections.length === 0 && (
                <p className="py-4 font-body-small text-on-surface-variant">
                  No matching collections or products
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-primary/20 backdrop-blur-xl"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 0.9, 0.3, 1] }}
              className="absolute right-0 top-0 flex h-full w-[min(100%,360px)] flex-col bg-background px-margin-mobile py-8"
            >
              <div className="mb-12 flex items-start justify-between">
                <div>
                  <BrandName />
                  <p className="mt-2 font-body-small text-on-surface-variant">
                    {brand.tagline}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 font-label-caps text-primary"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">
                      {item.href === "/shop" ? "storefront" : "info"}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto border-t border-outline-variant/30 pt-8">
                <Link
                  href="/cart"
                  className="block bg-primary px-6 py-3 text-center font-label-caps text-on-primary"
                >
                  View Cart
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
