import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  orderNumber: z.string().min(3),
  email: z.string().email(),
});

/**
 * Option A — Shopify-native fulfillments.
 * Until Admin API credentials are set, return a branded demo payload
 * so the StatusTracker UI can be reviewed end-to-end.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, email } = schema.parse(body);

    if (process.env.SHOPIFY_ADMIN_API_TOKEN) {
      // TODO: query Shopify Admin for order by name + email, map fulfillment status
    }

    const normalized = orderNumber.replace(/^#/, "").toUpperCase();

    return NextResponse.json({
      orderNumber: normalized,
      placedOn: "12 October 2024",
      step: 2,
      items: [
        {
          title: "Layer Dress",
          meta: "Espresso / M",
          price: 21000,
        },
        {
          title: "Essential Pants",
          meta: "Tan / S",
          price: 6500,
        },
      ],
      address: [
        "Aria Mehta",
        "14, Palm Grove Avenue",
        "Bandra West, Mumbai 400050",
        "India",
      ],
      total: 27500,
      email,
      source: "demo",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
