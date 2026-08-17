import Link from "next/link";
import { brand } from "@/content/copy";

const EXPLORE = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/about#size-guide", label: "Size Guide" },
  { href: "/shipping-returns", label: "Shipping & Returns" },
  { href: "/track-order", label: "Track Order" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant/20 bg-surface-container-low px-margin-mobile py-section-mobile text-on-surface md:px-margin-desktop md:py-section">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-gutter md:grid-cols-12">
        <div className="flex flex-col justify-between md:col-span-5">
          <div>
            <div className="font-display-lg leading-none text-primary">
              {brand.name}
            </div>
            <p className="mt-6 max-w-sm font-body-small text-on-surface-variant">
              {brand.blurb}
            </p>
            <p className="mt-8 font-body-small text-on-surface-variant">
              Based in {brand.city} ·{" "}
              <a
                href={`mailto:maisonmarchve@gmail.com`}
                className="transition-colors hover:text-primary"
              >
                maisonmarchve@gmail.com
              </a>
            </p>
            <p className="mt-3 font-body-small text-on-surface-variant">
              © {new Date().getFullYear()} M&apos;ARCHVE. All rights reserved.
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <h3 className="mb-6 font-label-caps text-primary">Explore</h3>
          <div className="flex flex-col space-y-4">
            {EXPLORE.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-body-small text-on-surface-variant transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-4">
          <h3 className="mb-6 font-label-caps text-primary">Newsletter</h3>
          <p className="mb-8 font-body-small text-on-surface-variant">
            Join the archive for early access to new collections.
          </p>
          <form className="flex items-end border-b border-outline-variant pb-2">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-grow border-0 bg-transparent p-0 font-body-small text-primary placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="ml-4 whitespace-nowrap font-label-caps text-primary transition-colors hover:text-secondary"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
