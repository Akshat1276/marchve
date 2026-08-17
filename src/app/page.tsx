import Link from "next/link";
import { VortexGallery } from "@/components/gallery/VortexGallery";
import { ProductCard } from "@/components/ui/ProductCard";
import { getNewArrivals, getProducts } from "@/lib/shopify/catalog";

export default async function HomePage() {
  const [galleryProducts, arrivals] = await Promise.all([
    getProducts("all"),
    getNewArrivals(4),
  ]);

  return (
    <>
      <VortexGallery products={galleryProducts} />

      <section className="border-t border-outline-variant/20 bg-background px-margin-mobile py-section-mobile md:px-margin-desktop md:py-section">
        <div className="mb-12 flex items-end justify-between border-b border-outline-variant/30 pb-6">
          <h2 className="font-headline-md text-primary">New Arrivals</h2>
          <Link
            href="/shop"
            className="font-label-caps text-on-surface-variant transition-colors hover:text-primary"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-4">
          {arrivals.map((product, i) => (
            <div
              key={product.id}
              className={i === 3 ? "hidden md:block" : undefined}
            >
              <ProductCard product={product} aspect="portrait" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
