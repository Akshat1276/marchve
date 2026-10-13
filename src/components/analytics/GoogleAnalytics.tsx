"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function GoogleAnalyticsPageTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    // Skip the first render — the gtag snippet fires page_view on initial load.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const qs = searchParams.toString();
    const url = pathname + (qs ? "?" + qs : "");
    window.gtag("event", "page_view", { page_path: url, send_to: gaId });
  }, [pathname, searchParams, gaId]);

  return null;
}

/**
 * Tracks SPA navigations after the initial page load.
 * The gtag scripts themselves are loaded by the Server Component in layout.tsx.
 */
export function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsPageTracker gaId={gaId} />
    </Suspense>
  );
}
