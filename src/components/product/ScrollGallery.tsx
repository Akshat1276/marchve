"use client";

import Image from "next/image";
import type { ProductImage } from "@/lib/shopify/types";

interface ScrollGalleryProps {
  images: ProductImage[];
}

/**
 * Vertical scroll gallery — images stack one per row, full-width of the column.
 * On desktop the column is ~60 % of the viewport; the purchase panel beside it
 * becomes sticky so it stays visible while the user scrolls through images.
 */
export function ScrollGallery({ images }: ScrollGalleryProps) {
  if (!images.length) {
    return (
      <div className="h-[70vh] w-full bg-surface-container-low md:h-screen" />
    );
  }

  return (
    <div className="flex flex-col">
      {images.map((image, i) => (
        <div
          key={`${image.src}-${i}`}
          className="relative w-full"
          style={{ aspectRatio: "3 / 4" }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
