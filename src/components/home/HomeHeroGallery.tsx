import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HERO = {
  href: "/shop/all",
  label: "Shop the Collection",
  src: "/products/IMAGE-937.jpg",
  alt: "M'ARCHVE — shop the collection",
} as const;

const SPLIT = [
  {
    href: "/shop/shirts-tops",
    label: "Shop Blazers",
    src: "/products/IMAGE-715.jpg",
    alt: "M'ARCHVE — shop blazers",
  },
  {
    href: "/shop/dresses",
    label: "Shop Dresses",
    src: "/products/IMAGE-952.jpg",
    alt: "M'ARCHVE — shop dresses",
  },
] as const;

function HeroLink({
  href,
  label,
  src,
  alt,
  aspectClassName,
  labelClassName,
  priority,
  sizes,
}: {
  href: string;
  label: string;
  src: string;
  alt: string;
  aspectClassName: string;
  labelClassName: string;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden bg-surface-container",
        aspectClassName
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        sizes={sizes}
      />
      <span
        className={cn(
          "absolute z-10 font-label-caps text-white underline decoration-white underline-offset-[6px] drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)] transition-opacity group-hover:opacity-90",
          labelClassName
        )}
      >
        {label}
      </span>
    </Link>
  );
}

export function HomeHeroGallery() {
  return (
    <section className="w-full">
      <HeroLink
        href={HERO.href}
        label={HERO.label}
        src={HERO.src}
        alt={HERO.alt}
        priority
        sizes="100vw"
        aspectClassName="aspect-[4/5] md:aspect-[16/10]"
        labelClassName="left-margin-mobile top-1/2 max-w-[12rem] -translate-y-1/2 md:left-margin-desktop md:max-w-none"
      />

      <div className="grid grid-cols-2">
        {SPLIT.map((tile) => (
          <HeroLink
            key={tile.href}
            href={tile.href}
            label={tile.label}
            src={tile.src}
            alt={tile.alt}
            sizes="50vw"
            aspectClassName="aspect-[4/5] md:aspect-[3/4]"
            labelClassName="left-1/2 top-[65%] w-max max-w-[calc(100%-2rem)] -translate-x-1/2 text-center md:top-[68%]"
          />
        ))}
      </div>
    </section>
  );
}
