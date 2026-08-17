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
    title: "World of M'ARCHVE",
    lead: "Sophisticated yet relatable, aspirational but warm.",
    body: "We design for the modern woman — confident, refined, and ever-evolving.",
    debut:
      "Our debut collection, A Modern Archive, reimagines contemporary dressing through relaxed suiting, refined separates, and effortless silhouettes that transition seamlessly from work to weekends, dinners, travel, and everyday moments.",
  },
};

export const contact = {
  eyebrow: "03 — INQUIRIES",
  title: "CONTACT US",
  email: "maisonmarchve@gmail.com",
  phone: "+91 98202 55349",
  phoneLabel: "WhatsApp",
  phoneHref: "https://wa.me/919820255349",
  hours: [
    { day: "MONDAY – SATURDAY", time: "11:00 AM – 7:00 PM IST" },
    { day: "SUNDAY", time: "CLOSED" },
  ],
  supportNote: "WhatsApp support · Mon–Sat, 11 AM–7 PM IST",
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
  tabs: ["TROUSERS", "SHIRTS & TOPS", "DRESSES"] as const,
  tables: {
    TROUSERS: {
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
  title: "Shipping, Returns & Refunds",
  intro:
    "Returns and exchanges are handled carefully so each piece stays in archive condition. Please read the eligibility rules before initiating a request.",
  sections: [
    {
      heading: "Return Eligibility",
      body: "",
      bullets: [
        "Returns and exchanges must be requested within 7 days of receipt. Requests after this window will not be accepted.",
        "Only one return or exchange is permitted per order.",
        "Only one exchange is allowed per order.",
        "Items must be unworn, unwashed, and undamaged, with all original tags attached.",
        "Please return items in their original packaging to protect them in transit.",
        "Clothing sent without prior written approval will not be accepted.",
        "Once approved, exchanges are processed within 7 working days.",
      ],
    },
    {
      heading: "How to Initiate a Return",
      body: "The quickest way is through our Return Order Portal. Alternatively, follow the steps below.",
      steps: [
        "Email maisonmarchve@gmail.com from your registered email address, or WhatsApp +91 98202 55349 — within 7 days of receipt.",
        "Use the subject line: RETURNS",
        "Wait for written approval. You will receive packing and dispatch instructions once your request is reviewed. Do not send items before receiving written approval. Unapproved returns will not be accepted.",
      ],
    },
    {
      heading: "Support",
      body: "",
      bullets: [
        "WhatsApp +91 98202 55349 · Mon–Sat, 11 AM–7 PM IST",
        "Email maisonmarchve@gmail.com · Subject: RETURNS",
        "Hours: Monday – Saturday · 11:00 AM – 7:00 PM IST",
      ],
    },
  ],
};

export const checkoutHandoff = "Preparing your checkout…";
