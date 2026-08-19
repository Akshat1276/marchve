import type { ProductImage } from "./types";

/** Normalize a Shopify color option for filename / alt matching. */
export function colorMatchTokens(color: string): string[] {
  const raw = color.trim().toLowerCase();
  const spaced = raw.replace(/[_/]+/g, " ").replace(/\s+/g, " ").trim();
  const dashed = spaced.replace(/\s+/g, "-");
  const compact = spaced.replace(/\s+/g, "");

  const tokens = new Set<string>([spaced, dashed, compact]);

  // Gray / Grey interchangeable in merchant filenames
  if (compact === "gray" || compact === "grey") {
    tokens.add("gray");
    tokens.add("grey");
  }

  return [...tokens].filter(Boolean);
}

function haystack(image: ProductImage): string {
  return `${image.src} ${image.alt}`.toLowerCase();
}

/**
 * Pick which product color an image "belongs" to by finding the longest
 * matching color token in the CDN URL / alt text among known product colors.
 */
function bestColorForImage(
  image: ProductImage,
  colors: string[]
): string | null {
  const text = haystack(image);
  let best: { color: string; len: number } | null = null;

  for (const color of colors) {
    for (const token of colorMatchTokens(color)) {
      if (token.length < 2) continue;
      // Word-ish boundary: token appears as substring (filenames use -black- etc.)
      if (!text.includes(token)) continue;
      if (!best || token.length > best.len) {
        best = { color, len: token.length };
      }
    }
  }

  return best?.color ?? null;
}

/**
 * Filter product media to the selected colour using filename / alt conventions
 * (e.g. `agency-blazer-black-2.jpg`). Falls back to the full gallery when
 * nothing matches so single-colour products keep working.
 */
export function imagesForColor(
  images: ProductImage[],
  color: string,
  allColors: string[],
  fallbackImage?: ProductImage | null
): ProductImage[] {
  if (!images.length) {
    return fallbackImage ? [fallbackImage] : [];
  }

  // Single colour — no filtering needed
  if (allColors.length <= 1) return images;

  const matched = images.filter(
    (img) => bestColorForImage(img, allColors) === color
  );

  if (matched.length > 0) {
    if (fallbackImage?.src) {
      // Only prepend the variant image if it actually belongs to this color.
      // If it matches a *different* color it is the wrong hero shot (e.g. a
      // Black variant image prepended when the user selects Grey).
      const fallbackColor = bestColorForImage(fallbackImage, allColors);
      const fallbackBelongs = fallbackColor === color || fallbackColor === null;
      const withoutDup = matched.filter((img) => img.src !== fallbackImage.src);
      return fallbackBelongs
        ? [fallbackImage, ...withoutDup]
        : withoutDup.length > 0
          ? withoutDup
          : matched;
    }
    return matched;
  }

  // Nothing matched by filename — only use fallbackImage if it belongs to this color
  if (fallbackImage?.src) {
    const fallbackColor = bestColorForImage(fallbackImage, allColors);
    if (fallbackColor === color || fallbackColor === null) {
      return [fallbackImage];
    }
  }
  return images;
}
