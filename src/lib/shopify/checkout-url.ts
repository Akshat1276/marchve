/**
 * Shopify returns checkout URLs on the store's primary domain. For headless
 * storefronts, that domain often points at this Next.js app instead of Shopify,
 * so /cart/c/... would 404. Always send shoppers to the myshopify.com host.
 */
export function resolveCheckoutUrl(checkoutUrl: string): string {
  if (!checkoutUrl) return checkoutUrl;

  const shopifyHost = (
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN ||
    ""
  )
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  if (!shopifyHost) return checkoutUrl;

  try {
    const url = new URL(checkoutUrl);
    if (url.hostname !== shopifyHost) {
      url.hostname = shopifyHost;
    }
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}
