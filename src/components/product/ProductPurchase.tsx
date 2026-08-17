"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/shopify/types";
import { formatINR, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { Loader } from "@/components/ui/Loader";

export function ProductPurchase({
  product,
  color: colorProp,
  onColorChange,
}: {
  product: Product;
  color?: string;
  onColorChange?: (color: string) => void;
}) {
  const [internalColor, setInternalColor] = useState(product.colors[0]);
  const color = colorProp ?? internalColor;
  const setColor = (next: string) => {
    onColorChange?.(next);
    if (colorProp === undefined) setInternalColor(next);
  };
  const [size, setSize] = useState(
    product.sizes.find((s) =>
      product.variants.some((v) => v.size === s && v.available)
    ) ?? product.sizes[0]
  );
  const [adding, setAdding] = useState(false);
  const [openAcc, setOpenAcc] = useState<string | null>("fabric");
  const addItem = useCartStore((s) => s.addItem);

  const available = product.variants.some(
    (v) => v.color === color && v.size === size && v.available
  );

  const onAdd = async () => {
    if (!available) return;
    setAdding(true);
    try {
      await addItem(product, { color, size });
    } catch (error) {
      console.error("[add to bag]", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-center px-margin-mobile py-12 md:px-12 lg:px-16">
      <p className="mb-3 font-label-caps text-on-surface-variant">
        {product.category}
      </p>
      <h1 className="font-headline-md text-primary">{product.title}</h1>
      <p className="mt-4 font-data-mono text-primary">
        {formatINR(product.price)}
      </p>
      <p className="mt-8 max-w-md font-body-main text-on-surface-variant">
        {product.description}
      </p>

      <div className="mt-10">
        <p className="mb-4 font-label-caps text-on-surface-variant">Colour</p>
        <div className="flex flex-wrap gap-3">
          {product.colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "min-w-8 border px-3 py-2 font-label-caps",
                color === c
                  ? "border-primary text-primary"
                  : "border-outline-variant text-on-surface-variant"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-label-caps text-on-surface-variant">Size</p>
          <Link
            href="/about#size-guide"
            className="font-label-caps text-secondary underline-offset-4 hover:underline"
          >
            Size Guide
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {product.sizes.map((s) => {
            const ok = product.variants.some(
              (v) => v.color === color && v.size === s && v.available
            );
            return (
              <button
                key={s}
                type="button"
                disabled={!ok}
                onClick={() => setSize(s)}
                className={cn(
                  "border py-3 font-label-caps transition-colors",
                  size === s
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline-variant text-primary hover:border-primary",
                  !ok && "cursor-not-allowed opacity-40"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        disabled={!available || adding}
        onClick={onAdd}
        className="mt-10 w-full bg-primary py-4 font-label-caps text-on-primary transition-colors duration-400 hover:bg-secondary disabled:opacity-50"
      >
        {adding ? "Adding…" : "Add to Bag"}
      </button>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-background/70 backdrop-blur-md"
          >
            <Loader label="Threading the details…" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 space-y-0 border-t border-outline-variant/30">
        <Accordion
          id="fabric"
          title="Fabric & Care"
          open={openAcc === "fabric"}
          onToggle={() =>
            setOpenAcc(openAcc === "fabric" ? null : "fabric")
          }
        >
          <dl className="space-y-3 font-data-mono text-on-surface-variant">
            <div className="flex justify-between border-b border-outline-variant/20 pb-2">
              <dt>Composition</dt>
              <dd className="text-primary">{product.fabric}</dd>
            </div>
            <div className="flex justify-between border-b border-outline-variant/20 pb-2">
              <dt>Care</dt>
              <dd className="text-primary">{product.care}</dd>
            </div>
          </dl>
        </Accordion>
        <Accordion
          id="shipping"
          title="Shipping & Returns"
          open={openAcc === "shipping"}
          onToggle={() =>
            setOpenAcc(openAcc === "shipping" ? null : "shipping")
          }
        >
          <p className="font-body-small text-on-surface-variant">
            Dispatch in {product.dispatchTime}. Returns and exchanges must be
            requested within 7 days of receipt — unworn, with tags, and only
            after written approval.{" "}
            <Link href="/shipping-returns" className="text-primary underline">
              Full policy
            </Link>
          </p>
        </Accordion>
      </div>
    </div>
  );
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-outline-variant/30">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-label-caps text-primary">{title}</span>
        <span className="material-symbols-outlined text-on-surface-variant">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 0.9, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
