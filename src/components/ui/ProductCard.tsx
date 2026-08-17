import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { formatINR } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  stagger?: boolean;
  aspect?: "portrait" | "tall";
}

export function ProductCard({
  product,
  stagger = false,
  aspect = "tall",
}: ProductCardProps) {
  const hover = product.images[1] ?? product.images[0];

  return (
    <Link
      href={`/product/${product.handle}`}
      className={`group block ${stagger ? "md:mt-12" : ""}`}
    >
      <div
        className={`relative mb-4 overflow-hidden bg-surface-container ${
          aspect === "portrait" ? "aspect-[3/4]" : "aspect-[4/5]"
        }`}
      >
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
        {hover && hover.src !== product.images[0].src && (
          <Image
            src={hover.src}
            alt={hover.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
      </div>
      <h3 className="font-body-main text-primary">{product.title}</h3>
      <p className="mt-1 font-body-small text-on-surface-variant">
        {product.colors.join(" / ")} · {product.sizes.join(", ")}
      </p>
      <p className="mt-2 font-data-mono text-primary">
        {formatINR(product.price)}
      </p>
    </Link>
  );
}
