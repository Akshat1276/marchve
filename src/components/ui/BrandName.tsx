import { cn } from "@/lib/utils";

interface BrandNameProps {
  className?: string;
  /** logo = header, footer = footer wordmark, logo-lg = hero, inherit = inline in headings */
  size?: "logo" | "logo-lg" | "footer" | "inherit";
  apostropheClassName?: string;
}

const sizeClass = {
  logo: "font-brand-logo",
  "logo-lg": "font-brand-logo-lg",
  footer: "font-brand-logo-footer",
  inherit: "font-brand-logo-inherit",
} as const;

/** M'ARCHVE wordmark — Avenir throughout. */
export function BrandName({
  className,
  size = "logo",
  apostropheClassName,
}: BrandNameProps) {
  return (
    <span
      className={cn("brand-name text-primary", sizeClass[size], className)}
      aria-label="M'ARCHVE"
    >
      <span className="font-brand-name brand-name__m">M</span>
      <span
        className={cn(
          "font-brand-apostrophe brand-name__apostrophe",
          apostropheClassName
        )}
      >
        {"\u2019"}
      </span>
      <span className="font-brand-name brand-name__rest">ARCHVE</span>
    </span>
  );
}
