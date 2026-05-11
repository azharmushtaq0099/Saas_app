import type { ListingOutput } from "@/features/listing/schemas";

const UNSAFE_TO_SAFE_REPLACEMENTS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /\bguaranteed compliant\b/gi, replacement: "consider verifying compliance details" },
  { pattern: /\blegally approved\b/gi, replacement: "aligned with marketplace guidance where applicable" },
  { pattern: /\bcertified safe\b/gi, replacement: "please ensure safety details are verified" },
  { pattern: /\brisk[- ]free\b/gi, replacement: "lower-risk when reviewed carefully" },
  { pattern: /\bguaranteed sales\b/gi, replacement: "conversion-oriented positioning support" },
  { pattern: /\bmarketplace approved\b/gi, replacement: "reviewed for marketplace-friendly wording" },
  { pattern: /\b100% compliant\b/gi, replacement: "educational compliance awareness guidance" },
  { pattern: /\blegal advice\b/gi, replacement: "educational compliance awareness" },
];

function sanitizeText(text: string) {
  return UNSAFE_TO_SAFE_REPLACEMENTS.reduce(
    (result, rule) => result.replace(rule.pattern, rule.replacement),
    text,
  );
}

function sanitizeList(items: string[]) {
  return items.map(sanitizeText);
}

export function enforceSafeListingLanguage(output: ListingOutput): ListingOutput {
  return {
    ...output,
    title: sanitizeText(output.title),
    bulletPoints: sanitizeList(output.bulletPoints),
    description: sanitizeText(output.description),
    seoKeywords: sanitizeList(output.seoKeywords),
    emotionalSeoAngles: sanitizeList(output.emotionalSeoAngles),
    callToAction: sanitizeText(output.callToAction),
    tags: sanitizeList(output.tags),
    altText: sanitizeList(output.altText),
    marketplaceSafeLanguage: sanitizeList(output.marketplaceSafeLanguage),
    complianceSuggestions: sanitizeList(output.complianceSuggestions),
    packagingReminders: sanitizeList(output.packagingReminders),
    sourcingReminders: sanitizeList(output.sourcingReminders),
    safetyReminders: sanitizeList(output.safetyReminders),
    productRiskAlerts: sanitizeList(output.productRiskAlerts),
    platformOptimizationTips: sanitizeList(output.platformOptimizationTips),
  };
}
