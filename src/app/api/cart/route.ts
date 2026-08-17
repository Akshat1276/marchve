import { NextResponse } from "next/server";
import { z } from "zod";
import {
  addCartLines,
  createCart,
  fetchCart,
  removeCartLines,
  updateCartLines,
} from "@/lib/shopify/queries";
import { isShopifyConfigured } from "@/lib/shopify/client";

const addSchema = z.object({
  action: z.literal("add"),
  cartId: z.string().optional(),
  merchandiseId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
});

const updateSchema = z.object({
  action: z.literal("update"),
  cartId: z.string().min(1),
  lineId: z.string().min(1),
  quantity: z.number().int().min(0),
});

const removeSchema = z.object({
  action: z.literal("remove"),
  cartId: z.string().min(1),
  lineId: z.string().min(1),
});

const getSchema = z.object({
  action: z.literal("get"),
  cartId: z.string().min(1),
});

const bodySchema = z.discriminatedUnion("action", [
  addSchema,
  updateSchema,
  removeSchema,
  getSchema,
]);

export async function POST(request: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json(
      { error: "Shopify is not configured" },
      { status: 503 }
    );
  }

  try {
    const json = await request.json();
    const body = bodySchema.parse(json);

    if (body.action === "get") {
      const cart = await fetchCart(body.cartId);
      return NextResponse.json({ cart });
    }

    if (body.action === "add") {
      const lines = [
        { merchandiseId: body.merchandiseId, quantity: body.quantity },
      ];
      const cart = body.cartId
        ? await addCartLines(body.cartId, lines)
        : await createCart(lines);
      return NextResponse.json({ cart });
    }

    if (body.action === "update") {
      if (body.quantity < 1) {
        const cart = await removeCartLines(body.cartId, [body.lineId]);
        return NextResponse.json({ cart });
      }
      const cart = await updateCartLines(body.cartId, [
        { id: body.lineId, quantity: body.quantity },
      ]);
      return NextResponse.json({ cart });
    }

    // remove
    const cart = await removeCartLines(body.cartId, [body.lineId]);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error("[api/cart]", error);
    const message =
      error instanceof Error ? error.message : "Cart request failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
