"use client";

import { useEffect } from "react";
import type { Product } from "@/lib/shopify/types";
import { trackMetaEvent } from "@/lib/meta-pixel";

export function MetaProductView({ product }: { product: Product }) {
  useEffect(() => {
    trackMetaEvent("ViewContent", {
      content_ids: [product.id],
      content_name: product.title,
      content_type: "product",
      content_category: product.category,
      value: product.price,
      currency: "INR",
    });
  }, [product]);

  return null;
}
