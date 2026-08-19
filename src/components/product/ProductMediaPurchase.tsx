"use client";

import { useMemo, useState } from "react";
import { ScrollGallery } from "@/components/product/ScrollGallery";
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
    <section className="border-b border-outline-variant/20 md:flex md:items-start">
      {/* Left — scrollable image stack */}
      <div className="md:w-[60%]">
        <ScrollGallery key={color} images={filteredImages} />
      </div>

      {/* Right — sticky purchase panel */}
      <div className="md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:w-[40%] md:overflow-y-auto md:border-l md:border-outline-variant/20">
        <ProductPurchase
          product={product}
          color={color}
          onColorChange={setColor}
        />
      </div>
    </section>
  );
}
