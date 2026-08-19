export type CollectionHandle =
  | "dresses"
  | "co-ords"
  | "bottoms"
  | "shirts-tops"
  | "skirts"
  | "all";

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  available: boolean;
  price: number;
  /** Shopify variant-linked image (one per variant), when present */
  image?: ProductImage | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  category: string;
  collection: Exclude<CollectionHandle, "all">;
  description: string;
  price: number;
  fabric: string;
  care: string;
  dispatchTime: string;
  colors: string[];
  sizes: string[];
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface CartLine {
  id: string;
  /** Shopify ProductVariant GID — required for Storefront cart mutations */
  merchandiseId?: string;
  productId: string;
  handle: string;
  title: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: ProductImage;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  checkoutUrl: string;
}
