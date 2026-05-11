export const ETSY_PRIMARY_PRODUCT_FOCUS = {
  cotton: ["cotton t-shirts", "hoodies", "socks", "pants", "scarves", "vests"],
  wooden: [
    "birdhouses",
    "wooden shelves",
    "tables",
    "cabinets",
    "clocks",
    "walking sticks",
    "benches",
    "doghouses",
  ],
} as const;

const COTTON_TERMS = /\b(cotton|shirt|t-shirt|tee|hoodie|sock|pants|scarf|vest)\b/i;
const WOODEN_TERMS = /\b(wood|wooden|timber|oak|walnut|pine|bamboo|birdhouse|table|cabinet|clock|bench|doghouse)\b/i;

export type ProductFocusType = keyof typeof ETSY_PRIMARY_PRODUCT_FOCUS | "general";

export function inferProductFocusType(input: {
  productType?: string;
  material?: string;
  productText?: string;
}) {
  const haystack = [input.productType, input.material, input.productText].join(" ").toLowerCase();
  if (COTTON_TERMS.test(haystack)) return "cotton" as const;
  if (WOODEN_TERMS.test(haystack)) return "wooden" as const;
  return "general" as const;
}

export function getProductFocusExamples(type: ProductFocusType) {
  if (type === "general") return [];
  return ETSY_PRIMARY_PRODUCT_FOCUS[type];
}
