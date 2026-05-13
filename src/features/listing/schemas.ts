import { z } from "zod";

export const CURRENT_MARKETPLACES = ["etsy", "amazon", "tiktok_shop", "ebay"] as const;
export const FUTURE_MARKETPLACES = ["walmart", "bol", "allegro"] as const;

export const listingInputSchema = z.object({
  platform: z.enum(CURRENT_MARKETPLACES).default("etsy"),
  productTitle: z.string().max(180).optional(),
  keywords: z.string().max(500).optional(),
  productText: z.string().max(3000).optional(),
  /** Base64 data URLs can be large; cap to reduce accidental OOM / abuse. */
  imageDataUrl: z.string().max(12_000_000).optional(),
  productType: z.string().max(120).optional(),
  material: z.string().max(120).optional(),
  targetAudience: z.string().max(160).optional(),
  productStyle: z.string().max(120).optional(),
  emotionalPositioning: z.string().max(140).optional(),
  targetMarket: z.string().max(120).optional(),
  safetyConsiderations: z.string().max(500).optional(),
  productionStatus: z.enum(["handmade", "vintage", "manufactured"]).optional(),
});

export const listingOutputSchema = z.object({
  title: z.string().min(10).max(140),
  bulletPoints: z.array(z.string().min(10).max(180)).min(3).max(6),
  description: z.string().min(40),
  seoKeywords: z.array(z.string().min(2).max(30)).min(8).max(13),
  emotionalSeoAngles: z.array(z.string().min(8).max(180)).min(2).max(5),
  callToAction: z.string().min(8).max(160),
  tags: z.array(z.string().min(2).max(20)).length(13),
  altText: z.array(z.string().min(12).max(220)).min(2).max(5),
  marketplaceSafeLanguage: z.array(z.string().min(8).max(220)).min(2).max(6),
  complianceSuggestions: z.array(z.string().min(8).max(220)).min(2).max(6),
  packagingReminders: z.array(z.string().min(8).max(220)).min(2).max(5),
  sourcingReminders: z.array(z.string().min(8).max(220)).min(2).max(5),
  safetyReminders: z.array(z.string().min(8).max(220)).min(2).max(5),
  productRiskAlerts: z.array(z.string().min(8).max(220)).min(1).max(5),
  platformOptimizationTips: z.array(z.string().min(8).max(220)).min(2).max(6),
});

export type ListingInput = z.infer<typeof listingInputSchema>;
export type ListingOutput = z.infer<typeof listingOutputSchema>;
