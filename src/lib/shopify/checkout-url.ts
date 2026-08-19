function normalizeHost(value: string | undefined): string {
  return (value || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .toLowerCase();
}

/**
 * Host Shopify will actually serve checkout on.
 *
 * Shopify always 301s `/cart/c/...` from `*.myshopify.com` to the store's
 * primary domain (`x-redirect-reason: primary_domain_redirection`). If that
 * primary domain is this Next.js site (www.marchve.com on Vercel), checkout
 * 404s and no URL rewrite can fix it.
 *
 * Set NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN to whichever host is Shopify's
 * primary: either `*.myshopify.com`, or a subdomain like checkout.marchve.com
 * whose DNS CNAME points at shops.myshopify.com.
 */
export function checkoutHost(): string {
  return (
    normalizeHost(process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN) ||
    normalizeHost(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) ||
    normalizeHost(process.env.SHOPIFY_STORE_DOMAIN)
  );
}

export function resolveCheckoutUrl(checkoutUrl: string): string {
  if (!checkoutUrl) return checkoutUrl;

  const host = checkoutHost();
  if (!host) return checkoutUrl;

  try {
    const url = new URL(checkoutUrl);
    if (url.hostname !== host) {
      url.hostname = host;
    }
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}
