import type { ListingOutput } from "@/features/listing/schemas";

export function formatRawListingOutput(output: ListingOutput) {
  return `TITLE:
${output.title}

BULLET_POINTS:
${output.bulletPoints.map((point) => `- ${point}`).join("\n")}

DESCRIPTION:
${output.description}

SEO_KEYWORDS:
${output.seoKeywords.join(" | ")}

EMOTIONAL_SEO_ANGLES:
${output.emotionalSeoAngles.join(" | ")}

CALL_TO_ACTION:
${output.callToAction}

TAGS:
${output.tags.join(" | ")}

ALT_TEXT:
${output.altText.join(" | ")}

MARKETPLACE_SAFE_LANGUAGE:
${output.marketplaceSafeLanguage.join(" | ")}

COMPLIANCE_SUGGESTIONS:
${output.complianceSuggestions.join(" | ")}

PACKAGING_REMINDERS:
${output.packagingReminders.join(" | ")}

SOURCING_REMINDERS:
${output.sourcingReminders.join(" | ")}

SAFETY_REMINDERS:
${output.safetyReminders.join(" | ")}

PRODUCT_RISK_ALERTS:
${output.productRiskAlerts.join(" | ")}

PLATFORM_OPTIMIZATION_SUGGESTIONS:
${output.platformOptimizationTips.join(" | ")}`;
}
