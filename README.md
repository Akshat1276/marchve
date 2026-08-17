# M'ARCHVE

Headless Shopify storefront for M'ARCHVE — Next.js App Router, Tailwind, WebGL vortex home gallery, cascade PDP gallery.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Catalog loads from Shopify when `SHOPIFY_STOREFRONT_API_TOKEN` is set; otherwise it falls back to mock data.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- React Three Fiber + Drei (vortex gallery)
- Framer Motion, Zustand, React Hook Form + Zod
- Vercel-ready (`/api/contact`, `/api/track-order`, `/api/cart`)

## Routes

| Path | Notes |
|---|---|
| `/` | Vortex gallery + New Arrivals |
| `/shop/[collection]` | PLP |
| `/product/[handle]` | PDP + cascade gallery |
| `/cart` | Full-page bag (INR) |
| `/about` | About + size guide + contact form |
| `/track-order` | Guest order lookup |
| `/shipping-returns` | Policy copy |
| `/account` | Sign-in shell (Shopify auth later) |

Nav is **Shop / About** only.

## Shopify

1. Install the **Headless** sales channel and create a storefront.
2. Copy the **private** Storefront API token into `.env.local` as `SHOPIFY_STOREFRONT_API_TOKEN`.
3. Set `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` to your `*.myshopify.com` host.
4. Set `NEXT_PUBLIC_USE_MOCK_CATALOG=false`, restart `npm run dev`.
5. Products/collections load from Shopify; cart uses `/api/cart` and checkout redirects to Shopify (Razorpay).
