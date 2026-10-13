export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();

type MetaEventParams = Record<string, string | number | string[] | undefined>;

declare global {
  interface Window {
    fbq?: (
      command: "track" | "trackCustom" | "init",
      event: string,
      params?: MetaEventParams
    ) => void;
  }
}

export function isMetaPixelEnabled() {
  return Boolean(META_PIXEL_ID);
}

export function trackMetaEvent(event: string, params?: MetaEventParams) {
  if (!isMetaPixelEnabled() || typeof window === "undefined" || !window.fbq) {
    return;
  }
  window.fbq("track", event, params);
}
