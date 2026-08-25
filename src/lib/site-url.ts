/**
 * Canonical public site origin for SEO (sitemap, robots, metadata).
 * Ignores localhost so a mis-set Vercel env can't poison production SEO.
 */
export function getSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    "https://www.marchve.com",
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const normalized = raw.replace(/\/$/, "").trim();
    if (!normalized) continue;
    if (/localhost|127\.0\.0\.1/i.test(normalized)) continue;
    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
      return normalized;
    }
    return `https://${normalized}`;
  }

  return "https://www.marchve.com";
}
