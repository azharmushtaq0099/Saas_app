import { listingOutputSchema } from "@/features/listing/schemas";

export function parseStructuredListingOutput(raw: string) {
  const normalized = raw.trim();
  const match =
    normalized.match(
      /TITLE:\s*([\s\S]*?)\n\s*BULLET_POINTS:\s*([\s\S]*?)\n\s*DESCRIPTION:\s*([\s\S]*?)\n\s*SEO_KEYWORDS:\s*([\s\S]*?)\n\s*EMOTIONAL_SEO_ANGLES:\s*([\s\S]*?)\n\s*CALL_TO_ACTION:\s*([\s\S]*?)\n\s*TAGS:\s*([\s\S]*?)\n\s*ALT_TEXT:\s*([\s\S]*?)\n\s*MARKETPLACE_SAFE_LANGUAGE:\s*([\s\S]*?)\n\s*COMPLIANCE_SUGGESTIONS:\s*([\s\S]*?)\n\s*PACKAGING_REMINDERS:\s*([\s\S]*?)\n\s*SOURCING_REMINDERS:\s*([\s\S]*?)\n\s*SAFETY_REMINDERS:\s*([\s\S]*?)\n\s*PRODUCT_RISK_ALERTS:\s*([\s\S]*?)\n\s*PLATFORM_OPTIMIZATION_SUGGESTIONS:\s*([\s\S]*)$/i,
    ) ?? null;

  if (!match) return null;

  const title = match[1].trim();
  const bulletPoints = match[2]
    .split("\n")
    .map((line) => line.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean);
  const description = match[3].trim();
  const seoKeywords = match[4].split("|").map((v) => v.trim()).filter(Boolean).slice(0, 13);
  const emotionalSeoAngles = match[5].split("|").map((v) => v.trim()).filter(Boolean).slice(0, 5);
  const callToAction = match[6].trim();
  const tags = match[7].split("|").map((v) => v.trim()).filter(Boolean).slice(0, 13);
  const altText = match[8].split("|").map((v) => v.trim()).filter(Boolean).slice(0, 5);
  const marketplaceSafeLanguage = match[9].split("|").map((v) => v.trim()).filter(Boolean).slice(0, 6);
  const complianceSuggestions = match[10].split("|").map((v) => v.trim()).filter(Boolean).slice(0, 6);
  const packagingReminders = match[11].split("|").map((v) => v.trim()).filter(Boolean).slice(0, 5);
  const sourcingReminders = match[12].split("|").map((v) => v.trim()).filter(Boolean).slice(0, 5);
  const safetyReminders = match[13].split("|").map((v) => v.trim()).filter(Boolean).slice(0, 5);
  const productRiskAlerts = match[14].split("|").map((v) => v.trim()).filter(Boolean).slice(0, 5);
  const platformOptimizationTips = match[15]
    .split("|")
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 6);

  const parsed = listingOutputSchema.safeParse({
    title,
    bulletPoints,
    description,
    seoKeywords,
    emotionalSeoAngles,
    callToAction,
    tags,
    altText,
    marketplaceSafeLanguage,
    complianceSuggestions,
    packagingReminders,
    sourcingReminders,
    safetyReminders,
    productRiskAlerts,
    platformOptimizationTips,
  });

  return parsed.success ? parsed.data : null;
}
