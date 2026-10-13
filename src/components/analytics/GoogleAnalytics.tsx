"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function GoogleAnalyticsPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== "function") return;
    // Skip the first render — the gtag snippet fires page_view on initial load.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const qs = searchParams.toString();
    const url = pathname + (qs ? "?" + qs : "");
    window.gtag("event", "page_view", { page_path: url });
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  const gaScriptUrl = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  const gaInitScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', { page_path: window.location.pathname });
  `;

  return (
    <>
      {/* Load the gtag.js library */}
      <Script src={gaScriptUrl} strategy="afterInteractive" />
      {/* Initialise the data layer and fire the initial page_view */}
      <Script id="google-analytics" strategy="afterInteractive">
        {gaInitScript}
      </Script>
      {/* Track subsequent SPA navigations */}
      <Suspense fallback={null}>
        <GoogleAnalyticsPageTracker />
      </Suspense>
    </>
  );
}
