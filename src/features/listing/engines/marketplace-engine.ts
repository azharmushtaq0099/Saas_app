import type { ListingInput } from "@/features/listing/schemas";

const MARKETPLACE_CONTEXT: Record<
  ListingInput["platform"],
  {
    voice: string;
    notices: string[];
  }
> = {
  etsy: {
    voice: "Handcrafted, story-led, and emotionally resonant copy for artisan buyers.",
    notices: [
      "Use transparent handmade/vintage/manufactured language that reflects the real product.",
      "Avoid brand references or claims that cannot be substantiated in your listing details.",
    ],
  },
  amazon: {
    voice: "Benefit-forward copy with concise scannability and factual structure.",
    notices: [
      "Use factual, verifiable product claims and avoid unsupported superlatives.",
      "Keep safety and material details consistent with listing attributes and images.",
    ],
  },
  tiktok_shop: {
    voice: "Short-form discovery language with concise hooks and compliance-sensitive wording.",
    notices: [
      "Use concise safety-forward copy suitable for short-form discovery traffic.",
      "Avoid sensitive or exaggerated claims that can trigger moderation review.",
    ],
  },
  ebay: {
    voice: "Clear condition, compatibility, and item-specific clarity for transaction confidence.",
    notices: [
      "Clearly disclose product condition, included parts, and any material limitations.",
      "Keep listing statements consistent with photos and item specifics.",
    ],
  },
};

export function getMarketplaceStrategy(platform: ListingInput["platform"]) {
  return MARKETPLACE_CONTEXT[platform];
}
