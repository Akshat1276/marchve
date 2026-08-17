import { notFound } from "next/navigation";
import { ProductMediaPurchase } from "@/components/product/ProductMediaPurchase";
import { ProductCard } from "@/components/ui/ProductCard";
import { getProduct, getProducts } from "@/lib/shopify/catalog";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const related = (await getProducts(product.collection))
    .filter((p) => p.handle !== product.handle)
    .slice(0, 4);

  return (
    <div className="pt-20">
      <ProductMediaPurchase product={product} />

      {related.length > 0 && (
        <section className="bg-surface-container-low px-margin-mobile py-section-mobile md:px-margin-desktop md:py-section">
          <h2 className="mb-12 font-headline-md text-primary">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {related.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                aspect="portrait"
                stagger={i % 2 === 1}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
