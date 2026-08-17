"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cart, CartLine, Product } from "@/lib/shopify/types";

interface CartState {
  cartId: string | null;
  checkoutUrl: string | null;
  lines: CartLine[];
  hydrated: boolean;
  addItem: (
    product: Product,
    opts: { color: string; size: string; quantity?: number }
  ) => Promise<void>;
  updateQty: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  clear: () => void;
  syncFromShopify: () => Promise<void>;
  itemCount: () => number;
  subtotal: () => number;
}

interface PersistedCart {
  cartId: string | null;
  checkoutUrl: string | null;
  lines: CartLine[];
}

function applyCart(cart: Cart | null) {
  if (!cart) {
    return {
      cartId: null as string | null,
      checkoutUrl: null as string | null,
      lines: [] as CartLine[],
    };
  }
  return {
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lines: cart.lines,
  };
}

async function cartRequest(body: Record<string, unknown>): Promise<Cart | null> {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { cart?: Cart | null; error?: string };
  if (!res.ok) {
    throw new Error(data.error || "Cart request failed");
  }
  return data.cart ?? null;
}

export const useCartStore = create<CartState>()(
  persist<CartState, [], [], PersistedCart>(
    (set, get) => ({
      cartId: null,
      checkoutUrl: null,
      lines: [],
      hydrated: false,

      addItem: async (product, { color, size, quantity = 1 }) => {
        const variant = product.variants.find(
          (v) => v.color === color && v.size === size && v.available
        );
        if (!variant) {
          throw new Error("Selected variant is unavailable");
        }

        // Local optimistic path if Shopify API is unavailable (mock mode)
        try {
          const cart = await cartRequest({
            action: "add",
            cartId: get().cartId ?? undefined,
            merchandiseId: variant.id,
            quantity,
          });
          set(applyCart(cart));
        } catch {
          // Fallback: local-only cart (mock catalog / offline)
          const id = `${product.id}-${color}-${size}`;
          set((state) => {
            const existing = state.lines.find((l) => l.id === id);
            if (existing) {
              return {
                lines: state.lines.map((l) =>
                  l.id === id ? { ...l, quantity: l.quantity + quantity } : l
                ),
              };
            }
            const line: CartLine = {
              id,
              merchandiseId: variant.id,
              productId: product.id,
              handle: product.handle,
              title: product.title,
              color,
              size,
              price: product.price,
              quantity,
              image: product.images[0],
            };
            return { lines: [...state.lines, line] };
          });
        }
      },

      updateQty: async (lineId, quantity) => {
        const { cartId } = get();
        if (cartId) {
          try {
            const cart = await cartRequest({
              action: "update",
              cartId,
              lineId,
              quantity,
            });
            set(applyCart(cart));
            return;
          } catch (error) {
            console.error("[cart] updateQty", error);
          }
        }

        if (quantity < 1) {
          get().removeLine(lineId);
          return;
        }
        set((state) => ({
          lines: state.lines.map((l) =>
            l.id === lineId ? { ...l, quantity } : l
          ),
        }));
      },

      removeLine: async (lineId) => {
        const { cartId } = get();
        if (cartId) {
          try {
            const cart = await cartRequest({
              action: "remove",
              cartId,
              lineId,
            });
            set(applyCart(cart));
            return;
          } catch (error) {
            console.error("[cart] removeLine", error);
          }
        }
        set((state) => ({
          lines: state.lines.filter((l) => l.id !== lineId),
        }));
      },

      clear: () =>
        set({ cartId: null, checkoutUrl: null, lines: [] }),

      syncFromShopify: async () => {
        const { cartId } = get();
        if (!cartId) {
          set({ hydrated: true });
          return;
        }
        try {
          const cart = await cartRequest({ action: "get", cartId });
          set({ ...applyCart(cart), hydrated: true });
        } catch {
          set({ cartId: null, checkoutUrl: null, lines: [], hydrated: true });
        }
      },

      itemCount: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: () =>
        get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    }),
    {
      name: "marchve-cart",
      version: 2,
      partialize: (state) => ({
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
        lines: state.lines,
      }),
      migrate: () => ({
        cartId: null,
        checkoutUrl: null,
        lines: [],
      }),
      onRehydrateStorage: () => (state) => {
        state?.syncFromShopify();
      },
    }
  )
);
