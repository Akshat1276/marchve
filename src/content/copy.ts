export const brand = {
  name: "M'ARCHVE",
  tagline: "A MODERN ARCHIVE.",
  origin: 'Derived from "My Archive" — a personal collection of timeless pieces, moments, and design memories.',
  blurb:
    "A contemporary womenswear label creating elevated wardrobe essentials rooted in modern tailoring and timeless design.",
  pillars: ["TIMELESS", "SLOW FASHION", "ASPIRATIONAL"] as const,
  city: "Mumbai",
};

export const loaderLines = [
  "Steaming the archive…",
  "Pressing every pleat…",
  "Threading the details…",
  "Unfolding the collection…",
  "Cataloguing the season…",
  "Stitching things together…",
];

export const emptyStates = {
  cart: "Your archive is empty.",
  search: "No pieces match that search — try another term.",
};

export const about = {
  eyebrow: "01 — FOUNDATION",
  title: "ABOUT THE BRAND",
  paragraphs: [
    'Derived from "My Archive" — a personal collection of timeless pieces, moments, and design memories.',
    "M'ARCHVE is a contemporary womenswear label creating elevated wardrobe essentials rooted in modern tailoring and timeless design.",
    "Every piece is designed to outlive trends and become part of a lasting wardrobe. Crafted in premium fabrics and produced in limited quantities, M'ARCHVE celebrates thoughtful design, versatility and understated luxury.",
  ],
  world: {
    titleLead: "World of",
    lead: "Sophisticated yet relatable, aspirational but warm.",
    body: "We design for the modern woman — confident, refined, and ever-evolving.",
    debut:
      "Our debut collection, A Modern Archive, reimagines contemporary dressing through relaxed suiting, refined separates, and effortless silhouettes that transition seamlessly from work to weekends, dinners, travel, and everyday moments.",
  },
};

export const social = {
  instagram: {
    href: "https://www.instagram.com/marchvemumbai?igsh=MXhrZTJ3eHdoYWd4YQ==",
    label: "@marchvemumbai",
  },
  whatsapp: {
    href: "https://wa.me/919820255349",
    label: "WhatsApp",
  },
};

export const contact = {
  eyebrow: "03 — INQUIRIES",
  title: "CONTACT US",
  email: "maisonmarchve@gmail.com",
  phone: "+91 98202 55349",
  phoneLabel: "WhatsApp",
  phoneHref: "https://wa.me/919820255349",
  supportRows: [
    {
      label: "WHATSAPP",
      value: "+91 98202 55349 · Mon–Sat, 11 AM–7 PM IST",
      href: "https://wa.me/919820255349",
    },
    {
      label: "EMAIL",
      value: "maisonmarchve@gmail.com",
      href: "mailto:maisonmarchve@gmail.com",
    },
  ],
  location: {
    label: "BASED IN",
    lines: ["Mumbai", "India"],
  },
};

export type SizeGuideColumn = {
  key: string;
  label: string;
};

/** Measurements stored in inches: a single value or a [min, max] range. */
export type SizeMeasure = number | readonly [number, number];

export type SizeGuideRow = {
  size: string;
  values: Record<string, SizeMeasure>;
};

export type SizeGuideTableData = {
  columns: SizeGuideColumn[];
  rows: SizeGuideRow[];
  note?: string;
};

export const sizeGuide = {
  eyebrow: "02 — MEASUREMENTS",
  title: "SIZE GUIDE",
  tabs: ["BOTTOMS", "SHIRTS & TOPS", "DRESSES"] as const,
  tables: {
    BOTTOMS: {
      columns: [
        { key: "waist", label: "WAIST" },
        { key: "hips", label: "HIPS" },
        { key: "length", label: "LENGTH" },
        { key: "inseam", label: "INSEAM" },
      ],
      rows: [
        {
          size: "XS (0)",
          values: { waist: 24, hips: 34, length: 41, inseam: 29 },
        },
        {
          size: "S (2)",
          values: { waist: 26, hips: 36, length: 42, inseam: 29.5 },
        },
        {
          size: "M (4)",
          values: { waist: 28, hips: 38, length: 43, inseam: 30 },
        },
        {
          size: "L (6-8)",
          values: { waist: 31.5, hips: 41, length: 43, inseam: 30 },
        },
        {
          size: "XL (10-12)",
          values: { waist: 33.5, hips: 42.5, length: 43, inseam: 30 },
        },
      ],
    },
    "SHIRTS & TOPS": {
      columns: [
        { key: "bust", label: "BUST" },
        { key: "waist", label: "WAIST" },
      ],
      rows: [
        { size: "XS", values: { bust: [32, 33], waist: [24, 25] } },
        { size: "S", values: { bust: [34, 35], waist: [26, 27] } },
        { size: "M", values: { bust: [36, 37.5], waist: [28, 29.75] } },
        { size: "L", values: { bust: [39, 40.5], waist: [31.5, 33.25] } },
        { size: "XL", values: { bust: 42, waist: 35 } },
      ],
    },
    DRESSES: {
      columns: [
        { key: "bust", label: "BUST" },
        { key: "waist", label: "WAIST" },
        { key: "hips", label: "HIPS" },
      ],
      rows: [
        {
          size: "XS",
          values: { bust: [32, 33], waist: [24, 25], hips: [34, 35] },
        },
        {
          size: "S",
          values: { bust: [34, 35], waist: [26, 27], hips: [36, 37] },
        },
        {
          size: "M",
          values: { bust: [36, 37.5], waist: [28, 29.75], hips: [38, 39.5] },
        },
        {
          size: "L",
          values: { bust: [39, 40.5], waist: [31.5, 33.25], hips: [41, 42.5] },
        },
        {
          size: "XL",
          values: { bust: 42, waist: 35, hips: 44 },
        },
      ],
    },
  } satisfies Record<string, SizeGuideTableData>,
};

export const shippingReturns = {
  title: "Returns & Exchanges Policy",
  intro: "",
  sections: [
    {
      heading: "Return Eligibility",
      body:
        "Returns and exchanges must be requested within 14 days of receipt. Requests after this window will not be accepted.",
      bullets: [
        "We do not offer refunds. Approved returns are issued as store credit only.",
        "Only one return or exchange is permitted per order.",
        "Only one exchange is allowed per order, regardless of reason.",
        "Items must be unworn, unwashed, and undamaged, with all original tags attached.",
        "Please return items in their original packaging to protect them in transit.",
      ],
    },
    {
      heading: "How to Initiate a Return",
      paragraphs: [
        `To request a return or exchange, please email ${contact.email} within 14 days of delivery.`,
        "Our team will review your request and guide you through the next steps.",
        "All returns are subject to approval based on our return policy. Returns sent without prior authorisation may not be accepted.",
      ],
    },
    {
      heading: "When will I receive my store credit?",
      paragraphs: [
        "Once your return has been approved, your store credit will be issued via email as a Shopify Gift Card.",
        "Store credit is valid for 12 months from the date of issue and applies to the value of the returned garment only.",
        "Original shipping charges are non-refundable, and return shipping costs are the responsibility of the customer.",
      ],
    },
    {
      heading: "Who covers return shipping?",
      body:
        "Return shipping costs are the responsibility of the customer. Original shipping charges are non-refundable and store credit applies only to the value of the returned garment.",
    },
    {
      heading: "What happens if my return doesn't meet the return conditions?",
      paragraphs: [
        "Items returned without their original tags, or those that have been worn, washed, used or altered, cannot be accepted.",
        "Returns sent without prior authorisation may be refused, and it will be the customer's responsibility to arrange collection of the garment.",
      ],
    },
  ],
};

export const checkoutHandoff = "Preparing your checkout…";
