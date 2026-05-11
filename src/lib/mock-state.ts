import "server-only";
import type { ListingOutput } from "@/features/listing/schemas";

export type MockUser = {
  id: string;
  email: string;
  is_pro: boolean;
  usage_count: number;
};

type MockDb = {
  is_pro: boolean;
  usage_count: number;
};

const FREE_LIMIT = 3;

const mockDb: MockDb = {
  is_pro: false,
  usage_count: 0,
};

export function getMockUser(): MockUser {
  return {
    id: "mock-user",
    email: "demo@test.com",
    is_pro: mockDb.is_pro,
    usage_count: mockDb.usage_count,
  };
}

export function getMockEntitlement() {
  return {
    is_pro: mockDb.is_pro,
    usage_count: mockDb.usage_count,
  };
}

export function consumeMockGeneration(limitFree = FREE_LIMIT) {
  if (!mockDb.is_pro && mockDb.usage_count >= limitFree) {
    return {
      allowed: false,
      used: mockDb.usage_count,
      remaining: 0,
    };
  }

  mockDb.usage_count += 1;
  return {
    allowed: true,
    used: mockDb.usage_count,
    remaining: mockDb.is_pro ? 999 : Math.max(0, limitFree - mockDb.usage_count),
  };
}

export async function simulateMockUpgrade(delayMs = 1000) {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  mockDb.is_pro = true;
}

export function resetMockUserState() {
  mockDb.is_pro = false;
  mockDb.usage_count = 0;
}

export function getMockAiOutput(): ListingOutput {
  return {
    title: "Handmade Walnut Keepsake Box - Personalized Gift for Meaningful Moments",
    bulletPoints: [
      "Crafted from natural walnut with a smooth, premium hand-finished surface.",
      "Sized for jewelry, letters, and memory items with everyday practicality.",
      "Designed for gift-givers seeking emotional storytelling and timeless style.",
      "Balanced language and structure optimized for marketplace readability.",
    ],
    description:
      "This handcrafted walnut keepsake box blends practical storage with emotional value. The clean silhouette and natural grain create a premium presentation that works for gifting, anniversaries, and personal memory collections.\n\nThe listing language is intentionally clear and buyer-friendly, helping shoppers quickly understand product use, tone, and craftsmanship without keyword stuffing.",
    seoKeywords: [
      "handmade keepsake box",
      "walnut gift box",
      "memory storage box",
      "personalized keepsake",
      "premium handmade gift",
      "anniversary gift box",
      "rustic modern decor",
      "sentimental gift idea",
    ],
    emotionalSeoAngles: [
      "Meaningful gift that preserves personal memories",
      "Timeless design that feels intentional and thoughtful",
      "Craftsmanship-led identity for premium buyers",
    ],
    callToAction: "Add this keepsake box to your cart and turn gifting into a lasting memory.",
    tags: [
      "keepsake box",
      "handmade gift",
      "walnut box",
      "memory box",
      "gift for her",
      "gift for him",
      "anniversary gift",
      "rustic decor",
      "wooden storage",
      "personalized gift",
      "premium craft",
      "minimalist gift",
      "sentimental gift",
    ],
    altText: [
      "Handmade walnut keepsake box with natural grain and clean rectangular profile on neutral background.",
      "Open wooden memory box showing smooth interior and premium handcrafted finish for gift presentation.",
    ],
    marketplaceSafeLanguage: [
      "Avoid absolute claims like certain outcomes or best on market.",
      "Use factual craftsmanship language based on visible product details.",
      "Keep buyer expectations clear around usage and material characteristics.",
    ],
    complianceSuggestions: [
      "Include clear material information and care notes where relevant.",
      "Avoid trademarked names unless authorized for resale context.",
      "Add realistic shipping and handling expectations in listing policy fields.",
    ],
    packagingReminders: [
      "Use protective inner wrapping to reduce scuffing during fulfillment.",
      "Label fragile elements and include concise care instructions inside the parcel.",
    ],
    sourcingReminders: [
      "Keep supplier invoices and wood species details for traceability.",
      "Document finishing materials used so listing claims stay consistent with production.",
    ],
    safetyReminders: [
      "If marketed for children, include clear age guidance and detachable-part warnings where relevant.",
      "Avoid unverified safety statements and confirm destination-market requirements before publishing.",
    ],
    productRiskAlerts: [
      "Wood grain and tone can vary naturally; avoid overpromising uniform texture.",
      "If personalization is offered, define character limits and turnaround times.",
    ],
    platformOptimizationTips: [
      "Lead with emotional-intent keywords in the first third of the title.",
      "Use concise scannable bullets to improve mobile conversion clarity.",
      "Match top tags to your first listing sentence for semantic consistency.",
    ],
  };
}

