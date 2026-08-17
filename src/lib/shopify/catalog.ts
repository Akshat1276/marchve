import { COLLECTIONS, PRODUCTS } from "./mock-data";
import { isShopifyConfigured } from "./client";
import {
  fetchAllProducts,
  fetchCollectionProducts,
  fetchProductByHandle,
} from "./queries";
import type { CollectionHandle, Product } from "./types";

function useMock() {
  return (
    !isShopifyConfigured() ||
    process.env.NEXT_PUBLIC_USE_MOCK_CATALOG === "true"
  );
}

export function getCollections() {
  return COLLECTIONS;
}

export async function getProducts(collection?: CollectionHandle) {
  if (!useMock()) {
    try {
      if (!collection || collection === "all") {
        return await fetchAllProducts();
      }
      return await fetchCollectionProducts(collection);
    } catch (error) {
      console.error("[shopify] getProducts failed, falling back to mock", error);
    }
  }

  if (!collection || collection === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.collection === collection);
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (!useMock()) {
    try {
      const product = await fetchProductByHandle(handle);
      if (product) return product;
    } catch (error) {
      console.error("[shopify] getProduct failed, falling back to mock", error);
    }
  }

  return PRODUCTS.find((p) => p.handle === handle) ?? null;
}

export async function getNewArrivals(limit = 4) {
  const products = await getProducts("all");
  return products.slice(0, limit);
}
