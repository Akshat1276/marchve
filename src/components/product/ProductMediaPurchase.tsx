"use client";

import { useMemo, useState } from "react";
import { CircularCarousel } from "@/components/product/CircularCarousel";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { imagesForColor } from "@/lib/shopify/images";
import type { Product } from "@/lib/shopify/types";

export function ProductMediaPurchase({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0] ?? "Default");

  const variantImage =
    product.variants.find((v) => v.color === color && v.image)?.image ?? null;

  const filteredImages = useMemo(
    () =>
      imagesForColor(
        product.images,
        color,
        product.colors,
        variantImage
      ),
    [product.images, product.colors, color, variantImage]
  );

  return (
    <section className="flex flex-col border-b border-outline-variant/20 md:flex-row">
      <div className="border-outline-variant/20 md:w-3/5 md:border-r">
        <CircularCarousel key={color} images={filteredImages} />
      </div>
      <div className="md:w-2/5">
        <ProductPurchase
          product={product}
          color={color}
          onColorChange={setColor}
        />
      </div>
    </section>
  );
}
