"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { emptyStates, checkoutHandoff } from "@/content/copy";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { Loader } from "@/components/ui/Loader";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeLine = useCartStore((s) => s.removeLine);
  const subtotal = useCartStore((s) => s.subtotal);
  const checkoutUrl = useCartStore((s) => s.checkoutUrl);
  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // The back/forward cache restores JS state, so a user returning from the
    // hosted checkout would otherwise land back behind the handoff overlay.
    const clearHandoff = () => setCheckingOut(false);
    window.addEventListener("pageshow", clearHandoff);
    return () => window.removeEventListener("pageshow", clearHandoff);
  }, []);

  if (!mounted) {
    return (
      <div className="pt-20">
        <Loader className="min-h-[50vh]" label="Cataloguing the season…" />
      </div>
    );
  }

  const count = lines.reduce((n, l) => n + l.quantity, 0);

  const checkout = async () => {
    setCheckoutError(null);
    if (!checkoutUrl) {
      setCheckoutError(
        "Checkout is not ready yet. Add an item again after Shopify is connected."
      );
      return;
    }
    setCheckingOut(true);
    window.location.href = checkoutUrl;
  };

  return (
    <div className="px-margin-mobile pb-section-mobile pt-28 md:px-margin-desktop md:pb-section">
      <div className="mb-12 border-b border-outline-variant/30 pb-6">
        <h1 className="font-display-lg text-primary">Shopping Bag</h1>
        <p className="mt-3 font-body-small text-on-surface-variant">
          {count} {count === 1 ? "item" : "items"} in your bag
        </p>
      </div>

      {lines.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <p className="font-headline-md text-primary">{emptyStates.cart}</p>
          <Link
            href="/shop"
            className="mt-8 bg-primary px-12 py-4 font-label-caps text-on-primary transition-colors hover:bg-secondary"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <ul className="space-y-10 lg:col-span-8">
            {lines.map((line) => (
              <li
                key={line.id}
                className="grid grid-cols-1 gap-6 border-b border-outline-variant/30 pb-10 md:grid-cols-[160px_1fr]"
              >
                <Link
                  href={`/product/${line.handle}`}
                  className="relative aspect-[3/4] max-w-[200px] overflow-hidden bg-surface-container"
                >
                  <Image
                    src={line.image.src}
                    alt={line.image.alt}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </Link>
                <div className="flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/product/${line.handle}`}
                        className="font-body-main text-primary hover:text-secondary"
                      >
                        {line.title}
                      </Link>
                      <p className="mt-3 font-data-mono text-on-surface-variant">
                        Colour {line.color} / Size {line.size}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove"
                      onClick={() => removeLine(line.id)}
                      className="text-on-surface-variant hover:text-primary"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-8">
                    <div className="flex items-center gap-4 border-b border-outline-variant pb-1">
                      <button
                        type="button"
                        onClick={() => updateQty(line.id, line.quantity - 1)}
                        className="font-data-mono text-primary"
                      >
                        −
                      </button>
                      <span className="font-data-mono text-primary">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(line.id, line.quantity + 1)}
                        className="font-data-mono text-primary"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-data-mono text-primary">
                      {formatINR(line.price * line.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-outline-variant/30 bg-surface-container-low p-8 lg:sticky lg:top-28 lg:col-span-4">
            <h2 className="mb-8 font-label-caps text-primary">Order Summary</h2>
            <div className="space-y-4 font-body-small">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-data-mono">{formatINR(subtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="text-on-surface-variant">
                  Calculated at checkout
                </span>
              </div>
              <div className="flex justify-between border-t border-outline-variant/30 pt-4">
                <span className="font-label-caps text-primary">Total</span>
                <span className="font-data-mono text-primary">
                  {formatINR(subtotal())}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={checkout}
              className="mt-10 w-full bg-primary py-4 font-label-caps text-on-primary transition-colors hover:bg-secondary"
            >
              Proceed to Checkout
            </button>
            {checkoutError && (
              <p className="mt-4 font-body-small text-error">{checkoutError}</p>
            )}
          </aside>
        </div>
      )}

      <AnimatePresence>
        {isCheckingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <Loader fullScreen label={checkoutHandoff} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
