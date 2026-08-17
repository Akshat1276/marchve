import {
  mapShopifyCart,
  mapShopifyProduct,
  storefrontFetch,
  type ShopifyCart,
  type ShopifyProduct,
} from "./client";
import type { Cart } from "./types";

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  productType
  tags
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 50) { nodes { url altText width height } }
  options { name values }
  variants(first: 50) {
    nodes {
      id
      title
      availableForSale
      price { amount currencyCode }
      selectedOptions { name value }
      image { url altText }
    }
  }
  collections(first: 10) { nodes { handle title } }
  fabric: metafield(namespace: "custom", key: "fabric") { value }
  care: metafield(namespace: "custom", key: "care_instructions") { value }
  dispatchTime: metafield(namespace: "custom", key: "dispatch_time") { value }
`;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 50) {
    nodes {
      id
      quantity
      merchandise {
        ... on ProductVariant {
          id
          title
          selectedOptions { name value }
          price { amount currencyCode }
          image { url altText }
          product {
            id
            handle
            title
            featuredImage { url altText }
          }
        }
      }
    }
  }
`;

export async function fetchAllProducts() {
  const data = await storefrontFetch<{
    products: { nodes: ShopifyProduct[] };
  }>({
    query: `
      query AllProducts {
        products(first: 50, sortKey: TITLE) {
          nodes { ${PRODUCT_FIELDS} }
        }
      }
    `,
    tags: ["products"],
  });
  return data.products.nodes.map(mapShopifyProduct);
}

export async function fetchCollectionProducts(handle: string) {
  const data = await storefrontFetch<{
    collection: {
      products: { nodes: ShopifyProduct[] };
    } | null;
  }>({
    query: `
      query CollectionProducts($handle: String!) {
        collection(handle: $handle) {
          products(first: 50) {
            nodes { ${PRODUCT_FIELDS} }
          }
        }
      }
    `,
    variables: { handle },
    tags: ["products", `collection-${handle}`],
  });

  if (!data.collection) return [];
  return data.collection.products.nodes.map(mapShopifyProduct);
}

export async function fetchProductByHandle(handle: string) {
  const data = await storefrontFetch<{
    product: ShopifyProduct | null;
  }>({
    query: `
      query ProductByHandle($handle: String!) {
        product(handle: $handle) {
          ${PRODUCT_FIELDS}
        }
      }
    `,
    variables: { handle },
    tags: ["products", `product-${handle}`],
  });

  return data.product ? mapShopifyProduct(data.product) : null;
}

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await storefrontFetch<{
    cartCreate: {
      cart: ShopifyCart | null;
      userErrors: { message: string }[];
    };
  }>({
    query: `
      mutation CartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart { ${CART_FIELDS} }
          userErrors { field message }
        }
      }
    `,
    variables: { lines },
    cache: "no-store",
  });

  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join("; "));
  }
  if (!data.cartCreate.cart) throw new Error("Cart create failed");
  return mapShopifyCart(data.cartCreate.cart);
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await storefrontFetch<{
    cartLinesAdd: {
      cart: ShopifyCart | null;
      userErrors: { message: string }[];
    };
  }>({
    query: `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ${CART_FIELDS} }
          userErrors { field message }
        }
      }
    `,
    variables: { cartId, lines },
    cache: "no-store",
  });

  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join("; "));
  }
  if (!data.cartLinesAdd.cart) throw new Error("Add to cart failed");
  return mapShopifyCart(data.cartLinesAdd.cart);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart> {
  const data = await storefrontFetch<{
    cartLinesUpdate: {
      cart: ShopifyCart | null;
      userErrors: { message: string }[];
    };
  }>({
    query: `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ${CART_FIELDS} }
          userErrors { field message }
        }
      }
    `,
    variables: { cartId, lines },
    cache: "no-store",
  });

  if (data.cartLinesUpdate.userErrors.length) {
    throw new Error(
      data.cartLinesUpdate.userErrors.map((e) => e.message).join("; ")
    );
  }
  if (!data.cartLinesUpdate.cart) throw new Error("Update cart failed");
  return mapShopifyCart(data.cartLinesUpdate.cart);
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const data = await storefrontFetch<{
    cartLinesRemove: {
      cart: ShopifyCart | null;
      userErrors: { message: string }[];
    };
  }>({
    query: `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ${CART_FIELDS} }
          userErrors { field message }
        }
      }
    `,
    variables: { cartId, lineIds },
    cache: "no-store",
  });

  if (data.cartLinesRemove.userErrors.length) {
    throw new Error(
      data.cartLinesRemove.userErrors.map((e) => e.message).join("; ")
    );
  }
  if (!data.cartLinesRemove.cart) throw new Error("Remove from cart failed");
  return mapShopifyCart(data.cartLinesRemove.cart);
}

export async function fetchCart(cartId: string): Promise<Cart | null> {
  const data = await storefrontFetch<{ cart: ShopifyCart | null }>({
    query: `
      query Cart($cartId: ID!) {
        cart(id: $cartId) { ${CART_FIELDS} }
      }
    `,
    variables: { cartId },
    cache: "no-store",
  });
  return data.cart ? mapShopifyCart(data.cart) : null;
}
