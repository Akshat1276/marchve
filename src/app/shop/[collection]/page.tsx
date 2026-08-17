import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ui/ProductCard";
import { PageLoader } from "@/components/ui/Loader";
import { getCollections, getProducts } from "@/lib/shopify/catalog";
import type { CollectionHandle } from "@/lib/shopify/types";
import { Suspense } from "react";

export function generateStaticParams() {
  return getCollections().map((c) => ({ collection: c.handle }));
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const collections = getCollections();
  const valid = collections.some((c) => c.handle === collection);
  if (!valid) notFound();

  return (
    <Suspense fallback={<PageLoader label="Unfolding the collection…" />}>
      <CollectionContent collection={collection as CollectionHandle} />
    </Suspense>
  );
}

async function CollectionContent({
  collection,
}: {
  collection: CollectionHandle;
}) {
  const [products, collections] = await Promise.all([
    getProducts(collection),
    Promise.resolve(getCollections()),
  ]);
  const current = collections.find((c) => c.handle === collection);

  return (
    <div className="pt-20">
      <div className="sticky top-20 z-30 border-b border-outline-variant/30 bg-background/90 backdrop-blur-xl">
        <div className="flex gap-8 overflow-x-auto px-margin-mobile py-4 md:px-margin-desktop">
          {collections.map((c) => (
            <Link
              key={c.handle}
              href={`/shop/${c.handle}`}
              className={`whitespace-nowrap border-b pb-1 font-label-caps transition-colors ${
                c.handle === collection
                  ? "border-secondary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-primary"
              }`}
            >
              {c.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-margin-mobile py-12 md:px-margin-desktop md:py-16">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 font-label-caps text-on-surface-variant">
              Collection
            </p>
            <h1 className="font-headline-md text-primary">
              {current?.title ?? "Shop"}
            </h1>
          </div>
          <p className="font-data-mono text-on-surface-variant">
            {products.length} pieces
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
