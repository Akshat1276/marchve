import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/shopify/catalog";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.marchve.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/about",
    "/shipping-returns",
    "/shipping-delivery",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/shop" ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.6,
  }));

  const collections = getCollections()
    .filter((c) => c.handle !== "all")
    .map((c) => ({
      url: `${SITE_URL}/shop/${c.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  let products: MetadataRoute.Sitemap = [];
  try {
    const all = await getProducts("all");
    products = all.map((product) => ({
      url: `${SITE_URL}/product/${product.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    products = [];
  }

  return [...staticRoutes, ...collections, ...products];
}
