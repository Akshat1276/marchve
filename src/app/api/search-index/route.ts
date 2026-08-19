import { NextResponse } from "next/server";
import { getCollections, getProducts } from "@/lib/shopify/catalog";

export async function GET() {
  const [collections, products] = await Promise.all([
    Promise.resolve(getCollections()),
    getProducts("all"),
  ]);

  const catalogCollections = collections.filter((c) => c.handle !== "all");

  return NextResponse.json({
    collections: catalogCollections.map((c) => ({
      handle: c.handle,
      title: c.title,
      products: products
        .filter((p) => p.collection === c.handle)
        .map((p) => ({ handle: p.handle, title: p.title })),
    })),
  });
}
