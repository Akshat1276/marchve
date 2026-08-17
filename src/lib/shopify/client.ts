import type {
  Cart,
  CartLine,
  CollectionHandle,
  Product,
  ProductImage,
  ProductVariant,
} from "./types";

const API_VERSION =
  process.env.SHOPIFY_STOREFRONT_API_VERSION || "2025-01";

function storeDomain() {
  const domain =
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    throw new Error("Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN");
  }
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** Prefer server-only token; fall back to NEXT_PUBLIC_ for local setup. */
function storefrontToken() {
  const token =
    process.env.SHOPIFY_STOREFRONT_API_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;
  if (!token) {
    throw new Error("Missing SHOPIFY_STOREFRONT_API_TOKEN");
  }
  return token;
}

export function isShopifyConfigured() {
  try {
    return Boolean(
      (process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
        process.env.SHOPIFY_STORE_DOMAIN) &&
        (process.env.SHOPIFY_STOREFRONT_API_TOKEN ||
          process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN) &&
        process.env.NEXT_PUBLIC_USE_MOCK_CATALOG !== "true"
    );
  } catch {
    return false;
  }
}

export async function storefrontFetch<T>({
  query,
  variables,
  cache = "force-cache",
  tags,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T> {
  const endpoint = `https://${storeDomain()}/api/${API_VERSION}/graphql.json`;
  const token = storefrontToken();

  // Headless "private" tokens must use Shopify-Storefront-Private-Token.
  // Public tokens use X-Shopify-Storefront-Access-Token. Sending the wrong
  // header (or both) returns 401 UNAUTHORIZED.
  const isPrivateToken =
    token.startsWith("shpat_") ||
    token.startsWith("shpca_") ||
    Boolean(process.env.SHOPIFY_STOREFRONT_API_TOKEN);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (isPrivateToken) {
    headers["Shopify-Storefront-Private-Token"] = token;
  } else {
    headers["X-Shopify-Storefront-Access-Token"] = token;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    cache,
    ...(tags ? { next: { tags } } : {}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify Storefront ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  if (!json.data) {
    throw new Error("Shopify Storefront returned no data");
  }

  return json.data;
}

/* ——— Shopify response shapes (minimal) ——— */

export type ShopifyMoney = { amount: string; currencyCode: string };

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type ShopifySelectedOption = { name: string; value: string };

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  selectedOptions: ShopifySelectedOption[];
  image?: ShopifyImage | null;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  tags: string[];
  featuredImage: ShopifyImage | null;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  images: { nodes: ShopifyImage[] };
  options: { name: string; values: string[] }[];
  variants: { nodes: ShopifyVariant[] };
  collections: {
    nodes: { handle: string; title: string }[];
  };
  fabric?: { value: string } | null;
  care?: { value: string } | null;
  dispatchTime?: { value: string } | null;
};

export type ShopifyCartLineNode = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: ShopifySelectedOption[];
    price: ShopifyMoney;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
    image?: ShopifyImage | null;
  };
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  lines: { nodes: ShopifyCartLineNode[] };
};

const COLLECTION_HANDLES: Exclude<CollectionHandle, "all">[] = [
  "dresses",
  "co-ords",
  "trousers",
  "shirts-tops",
  "skirts",
];

function moneyToNumber(m: ShopifyMoney): number {
  return Math.round(parseFloat(m.amount));
}

function optionValue(
  options: ShopifySelectedOption[],
  ...names: string[]
): string {
  const lower = names.map((n) => n.toLowerCase());
  const found = options.find((o) => lower.includes(o.name.toLowerCase()));
  return found?.value ?? "";
}

function mapCollection(
  product: ShopifyProduct
): Exclude<CollectionHandle, "all"> {
  const handles = product.collections.nodes.map((c) => c.handle.toLowerCase());
  for (const h of COLLECTION_HANDLES) {
    if (handles.includes(h)) return h;
  }
  // Soft match titles / product type
  const type = (product.productType || "").toLowerCase();
  if (type.includes("dress")) return "dresses";
  if (type.includes("coord") || type.includes("co-ord") || type.includes("co ord"))
    return "co-ords";
  if (type.includes("trouser") || type.includes("pant")) return "trousers";
  if (type.includes("skirt")) return "skirts";
  if (type.includes("shirt") || type.includes("top")) return "shirts-tops";
  return "shirts-tops";
}

function mapImages(product: ShopifyProduct): ProductImage[] {
  const nodes = product.images.nodes;
  if (nodes.length) {
    return nodes.map((img) => ({
      src: img.url,
      alt: img.altText || product.title,
    }));
  }
  if (product.featuredImage) {
    return [
      {
        src: product.featuredImage.url,
        alt: product.featuredImage.altText || product.title,
      },
    ];
  }
  return [{ src: "/products/1.jpg", alt: product.title }];
}

export function mapShopifyProduct(product: ShopifyProduct): Product {
  const variants: ProductVariant[] = product.variants.nodes.map((v) => {
    const color =
      optionValue(v.selectedOptions, "Color", "Colour", "color", "colour") ||
      "Default";
    const size =
      optionValue(v.selectedOptions, "Size", "size") ||
      v.title ||
      "One size";
    return {
      id: v.id,
      color,
      size,
      available: v.availableForSale,
      price: moneyToNumber(v.price),
      image: v.image
        ? {
            src: v.image.url,
            alt: v.image.altText || product.title,
          }
        : null,
    };
  });

  const colors = [...new Set(variants.map((v) => v.color))];
  const sizes = [...new Set(variants.map((v) => v.size))];
  const collection = mapCollection(product);
  const category =
    product.collections.nodes.find((c) => c.handle === collection)?.title ||
    product.productType ||
    collection;

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    category,
    collection,
    description: product.description || "",
    price: moneyToNumber(product.priceRange.minVariantPrice),
    fabric: product.fabric?.value || "See care label",
    care: product.care?.value || "Dry clean only",
    dispatchTime: product.dispatchTime?.value || "5-7 days",
    colors,
    sizes,
    images: mapImages(product),
    variants,
  };
}

export function mapShopifyCart(cart: ShopifyCart): Cart {
  const lines: CartLine[] = cart.lines.nodes.map((line) => {
    const opts = line.merchandise.selectedOptions;
    const color =
      optionValue(opts, "Color", "Colour", "color", "colour") || "Default";
    const size = optionValue(opts, "Size", "size") || "One size";
    const img =
      line.merchandise.image || line.merchandise.product.featuredImage;
    return {
      id: line.id,
      merchandiseId: line.merchandise.id,
      productId: line.merchandise.product.id,
      handle: line.merchandise.product.handle,
      title: line.merchandise.product.title,
      color,
      size,
      price: moneyToNumber(line.merchandise.price),
      quantity: line.quantity,
      image: {
        src: img?.url || "/products/1.jpg",
        alt: img?.altText || line.merchandise.product.title,
      },
    };
  });

  return {
    id: cart.id,
    lines,
    checkoutUrl: cart.checkoutUrl,
  };
}
