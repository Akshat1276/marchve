"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { brand } from "@/content/copy";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  const dark = pathname === "/";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full border-b backdrop-blur-xl",
          dark
            ? "border-white/10 bg-hero-ink/80 text-white"
            : "border-outline-variant/30 bg-background/90 text-primary"
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
            className={cn(
              "absolute left-1/2 -translate-x-1/2 font-headline-md tracking-tight",
              dark ? "text-white" : "text-primary"
            )}
          >
            {brand.name}
          </Link>

          <div className="flex items-center gap-4 md:gap-5">
            <Link
              href="/account"
              aria-label="Account"
              className={cn(
                "hidden transition-opacity hover:opacity-70 md:inline-flex",
                dark ? "text-white" : "text-on-surface-variant"
              )}
            >
              <span className="material-symbols-outlined">person</span>
            </Link>
            <Link
              href="/cart"
              aria-label="Shopping bag"
              className={cn(
                "relative transition-opacity hover:opacity-70",
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
                  <div className="font-headline-md text-primary">{brand.name}</div>
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
              <div className="mt-auto space-y-4 border-t border-outline-variant/30 pt-8">
                <Link
                  href="/account"
                  className="flex items-center gap-3 font-label-caps text-on-surface-variant"
                >
                  <span className="material-symbols-outlined">person</span>
                  Account
                </Link>
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
