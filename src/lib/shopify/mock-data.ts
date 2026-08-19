import type { Product } from "./types";

/** Local placeholders in /public/products — swap for Shopify CDN URLs later. */
const img = (n: number, alt: string) => ({
  src: `/products/${n}.jpg`,
  alt,
});

export const COLLECTIONS = [
  { handle: "dresses" as const, title: "Dresses" },
  { handle: "co-ords" as const, title: "Co-ords" },
  { handle: "bottoms" as const, title: "Bottoms" },
  { handle: "shirts-tops" as const, title: "Shirts & Tops" },
  { handle: "skirts" as const, title: "Skirts" },
  { handle: "all" as const, title: "Shop All" },
];

function variants(
  handle: string,
  colors: string[],
  sizes: string[],
  price: number
) {
  return colors.flatMap((color) =>
    sizes.map((size) => ({
      id: `${handle}-${color}-${size}`.toLowerCase().replace(/\s+/g, "-"),
      color,
      size,
      available: size !== "XXL",
      price,
    }))
  );
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    handle: "nora-lace-top",
    title: "Nora Lace Top",
    category: "Shirts & Tops",
    collection: "shirts-tops",
    description:
      "A quiet lace study with a clean neckline and architectural shoulder. Designed to layer under tailored outer pieces.",
    price: 5500,
    fabric: "64% cotton, 36% brocade",
    care: "Dry clean only, steam on low heat",
    dispatchTime: "5-7 days",
    colors: ["Black"],
    sizes: ["S", "M", "L"],
    images: [
      img(1, "Nora Lace Top front"),
      img(2, "Nora Lace Top detail"),
      img(3, "Nora Lace Top styled"),
    ],
    variants: variants("nora-lace-top", ["Black"], ["S", "M", "L"], 5500),
  },
  {
    id: "2",
    handle: "frame-trousers",
    title: "Frame Trousers",
    category: "Trousers",
    collection: "bottoms",
    description:
      "A tailored trouser with a framed waist and fluid fall. Soft structure for studio-to-street movement.",
    price: 7900,
    fabric: "75% poly, 21% rayon, 3% wool blend",
    care: "Dry clean only, steam on low heat",
    dispatchTime: "5-7 days",
    colors: ["Tan"],
    sizes: ["XXS", "XS", "S", "M"],
    images: [img(4, "Frame Trousers"), img(5, "Frame Trousers detail")],
    variants: variants("frame-trousers", ["Tan"], ["XXS", "XS", "S", "M"], 7900),
  },
  {
    id: "3",
    handle: "line-skirt",
    title: "Line Skirt",
    category: "Skirts",
    collection: "skirts",
    description:
      "A linear silhouette cut from lyocell-linen. Minimal hardware, maximum drape.",
    price: 5500,
    fabric: "70% Lyocell, 30% Linen",
    care: "Dry clean only, steam on low heat",
    dispatchTime: "5-7 days",
    colors: ["Black"],
    sizes: ["S", "M", "L"],
    images: [img(6, "Line Skirt"), img(7, "Line Skirt movement")],
    variants: variants("line-skirt", ["Black"], ["S", "M", "L"], 5500),
  },
  {
    id: "4",
    handle: "essential-pants",
    title: "Essential Pants",
    category: "Trousers",
    collection: "bottoms",
    description:
      "Everyday archive trousers in a lyocell-linen blend. Available in espresso and tan.",
    price: 6500,
    fabric: "70% Lyocell, 30% Linen",
    care: "Dry clean only, steam on low heat",
    dispatchTime: "5-7 days",
    colors: ["Espresso", "Tan"],
    sizes: ["S", "M", "L"],
    images: [img(8, "Essential Pants"), img(9, "Essential Pants detail")],
    variants: variants(
      "essential-pants",
      ["Espresso", "Tan"],
      ["S", "M", "L"],
      6500
    ),
  },
  {
    id: "5",
    handle: "layer-dress",
    title: "Layer Dress",
    category: "Dress",
    collection: "dresses",
    description:
      "A study in structural elegance. The Layer Dress features a fluid, asymmetrical drape constructed for quiet impact.",
    price: 21000,
    fabric: "55% Nylon, 45% Polyester",
    care: "Dry clean only, steam on low heat",
    dispatchTime: "5-7 days",
    colors: ["Espresso"],
    sizes: ["S", "M", "L"],
    images: [
      img(10, "Layer Dress front"),
      img(11, "Layer Dress side"),
      img(12, "Layer Dress back"),
      img(13, "Layer Dress detail"),
    ],
    variants: variants("layer-dress", ["Espresso"], ["S", "M", "L"], 21000),
  },
  {
    id: "6",
    handle: "sculpt-coord-set",
    title: "Sculpt Co-ord Set",
    category: "Co-ords",
    collection: "co-ords",
    description:
      "A sculpted two-piece set with controlled stretch. Worn together or apart.",
    price: 12500,
    fabric:
      "Top: 80% poly/16% rayon/4% spandex; Pants: 89% poly/7% linen/4% spandex",
    care: "Dry clean only, steam on low heat",
    dispatchTime: "5-7 days",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
    images: [img(14, "Sculpt Co-ord Set"), img(15, "Sculpt Co-ord detail")],
    variants: variants(
      "sculpt-coord-set",
      ["Black"],
      ["S", "M", "L", "XL"],
      12500
    ),
  },
  {
    id: "7",
    handle: "edition-coord-set",
    title: "Edition Co-ord Set",
    category: "Co-ords",
    collection: "co-ords",
    description:
      "Premium suiting co-ord with a soft shoulder and precise hem line.",
    price: 15500,
    fabric: "Premium suiting fabric",
    care: "Dry clean only, steam on low heat",
    dispatchTime: "5-7 days",
    colors: ["Gray"],
    sizes: ["S", "M", "L", "XL"],
    images: [img(16, "Edition Co-ord Set"), img(1, "Edition Co-ord detail")],
    variants: variants(
      "edition-coord-set",
      ["Gray"],
      ["S", "M", "L", "XL"],
      15500
    ),
  },
  {
    id: "8",
    handle: "contour-structured-dress",
    title: "Contour Structured Dress",
    category: "Dress",
    collection: "dresses",
    description:
      "Structured contouring meets soft volume. A day-to-evening silhouette.",
    price: 8500,
    fabric: "100% Polyester",
    care: "Dry clean only, steam on low heat",
    dispatchTime: "5-7 days",
    colors: ["Black", "Gray"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      img(2, "Contour Structured Dress"),
      img(3, "Contour Dress detail"),
    ],
    variants: variants(
      "contour-structured-dress",
      ["Black", "Gray"],
      ["XS", "S", "M", "L"],
      8500
    ),
  },
  {
    id: "9",
    handle: "studio-tank-dress",
    title: "Studio Tank Dress",
    category: "Dress",
    collection: "dresses",
    description:
      "A tank dress for studio heat and city evenings. Clean lines, easy ease.",
    price: 7500,
    fabric: "Cotton-poly blend",
    care: "Dry clean only, steam on low heat",
    dispatchTime: "5-7 days",
    colors: ["White", "Army"],
    sizes: ["XS", "S", "M", "L"],
    images: [img(4, "Studio Tank Dress"), img(5, "Studio Tank detail")],
    variants: variants(
      "studio-tank-dress",
      ["White", "Army"],
      ["XS", "S", "M", "L"],
      7500
    ),
  },
  {
    id: "10",
    handle: "muse-coord-set",
    title: "Muse Co-ord Set",
    category: "Co-ords",
    collection: "co-ords",
    description:
      "Linen-cotton co-ord in cream. Breathable structure for warm climates.",
    price: 10000,
    fabric: "Linen-cotton blend",
    care: "Dry clean only, steam on low heat",
    dispatchTime: "5-7 days",
    colors: ["Cream"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [img(6, "Muse Co-ord Set"), img(7, "Muse Co-ord detail")],
    variants: variants(
      "muse-coord-set",
      ["Cream"],
      ["XS", "S", "M", "L", "XL"],
      10000
    ),
  },
  {
    id: "11",
    handle: "archival-shirt",
    title: "Archival Shirt",
    category: "Shirts & Tops",
    collection: "shirts-tops",
    description:
      "An archival shirt cut in lyocell-polyester. Soft hand, sharp collar.",
    price: 6000,
    fabric: "68% Lyocell, 32% polyester",
    care: "Dry clean only, steam on low heat",
    dispatchTime: "5-7 days",
    colors: ["Ice Blue", "Tan", "White"],
    sizes: ["S", "M", "L"],
    images: [img(8, "Archival Shirt"), img(9, "Archival Shirt detail")],
    variants: variants(
      "archival-shirt",
      ["Ice Blue", "Tan", "White"],
      ["S", "M", "L"],
      6000
    ),
  },
  {
    id: "12",
    handle: "agency-blazer-shirt",
    title: "Agency Blazer Shirt",
    category: "Shirts & Tops",
    collection: "shirts-tops",
    description:
      "A free-size blazer shirt in Tencel blend. Structured ease for the desk and the door.",
    price: 9000,
    fabric: "90% Tencel, 10% polyester",
    care: "Dry clean only, steam on low heat",
    dispatchTime: "5-7 days",
    colors: ["Gray", "Black", "White"],
    sizes: ["Free-size"],
    images: [img(10, "Agency Blazer Shirt"), img(11, "Agency Blazer detail")],
    variants: variants(
      "agency-blazer-shirt",
      ["Gray", "Black", "White"],
      ["Free-size"],
      9000
    ),
  },
];
