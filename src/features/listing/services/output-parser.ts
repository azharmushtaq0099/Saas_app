import { listingOutputSchema } from "@/features/listing/schemas";

const SECTION_KEYS = [
  "TITLE",
  "BULLET_POINTS",
  "DESCRIPTION",
  "SEO_KEYWORDS",
  "EMOTIONAL_SEO_ANGLES",
  "CALL_TO_ACTION",
  "TAGS",
  "ALT_TEXT",
  "MARKETPLACE_SAFE_LANGUAGE",
  "COMPLIANCE_SUGGESTIONS",
  "PACKAGING_REMINDERS",
  "SOURCING_REMINDERS",
  "SAFETY_REMINDERS",
  "PRODUCT_RISK_ALERTS",
  "PLATFORM_OPTIMIZATION_SUGGESTIONS",
] as const;

type SectionKey = (typeof SECTION_KEYS)[number];

/** Strips BOM, normalizes newlines, removes common markdown fences around model output. */
export function normalizeAiListingRaw(raw: string) {
  let t = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```[a-z0-9]*\s*/i, "");
    t = t.replace(/\s*```\s*$/i, "");
  }
  return t.trim();
}

/** Collapses internal whitespace for single-line fields and list items (model drift). */
function normalizeSpaces(line: string) {
  return line.replace(/\s+/g, " ").trim();
}

function splitPipeList(section: string, max: number) {
  return section
    .split("|")
    .map((v) => normalizeSpaces(v))
    .filter(Boolean)
    .slice(0, max);
}

function parseBulletBlock(section: string) {
  return section
    .split("\n")
    .map((line) => line.replace(/^\s*[-*•]\s*/, "").trim())
    .map((line) => normalizeSpaces(line))
    .filter(Boolean);
}

/** Keeps intentional paragraph breaks; trims trailing noise between sections. */
function normalizeDescriptionBlock(text: string) {
  return text
    .split(/\n{3,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

function tryParseFromCaptureGroups(match: RegExpMatchArray) {
  const title = normalizeSpaces(match[1]);
  const bulletPoints = parseBulletBlock(match[2]);
  const description = normalizeDescriptionBlock(match[3]);
  const seoKeywords = splitPipeList(match[4], 13);
  const emotionalSeoAngles = splitPipeList(match[5], 5);
  const callToAction = normalizeSpaces(match[6]);
  const tags = splitPipeList(match[7], 13);
  const altText = splitPipeList(match[8], 5);
  const marketplaceSafeLanguage = splitPipeList(match[9], 6);
  const complianceSuggestions = splitPipeList(match[10], 6);
  const packagingReminders = splitPipeList(match[11], 5);
  const sourcingReminders = splitPipeList(match[12], 5);
  const safetyReminders = splitPipeList(match[13], 5);
  const productRiskAlerts = splitPipeList(match[14], 5);
  const platformOptimizationTips = splitPipeList(match[15], 6);

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

/**
 * Locates each section header in document order and slices content between headers.
 * More tolerant than a single mega-regex when the model adds blank lines or minor preamble.
 */
function tryParseBySectionHeaders(normalized: string) {
  const padded = normalized.startsWith("\n") ? normalized : `\n${normalized}`;
  const hits: { key: SectionKey; index: number; headerLen: number }[] = [];

  for (const key of SECTION_KEYS) {
    const re = new RegExp(`\\n\\s*${key}\\s*:`, "i");
    const m = padded.match(re);
    if (!m || m.index === undefined) return null;
    hits.push({ key, index: m.index, headerLen: m[0].length });
  }

  for (let i = 1; i < hits.length; i++) {
    if (hits[i].index <= hits[i - 1].index) return null;
  }

  const sections = {} as Record<SectionKey, string>;
  for (let i = 0; i < hits.length; i++) {
    const start = hits[i].index + hits[i].headerLen;
    const end = i + 1 < hits.length ? hits[i + 1].index : padded.length;
    sections[hits[i].key] = padded.slice(start, end).trim();
  }

  const parsed = listingOutputSchema.safeParse({
    title: normalizeSpaces(sections.TITLE),
    bulletPoints: parseBulletBlock(sections.BULLET_POINTS),
    description: normalizeDescriptionBlock(sections.DESCRIPTION),
    seoKeywords: splitPipeList(sections.SEO_KEYWORDS, 13),
    emotionalSeoAngles: splitPipeList(sections.EMOTIONAL_SEO_ANGLES, 5),
    callToAction: normalizeSpaces(sections.CALL_TO_ACTION),
    tags: splitPipeList(sections.TAGS, 13),
    altText: splitPipeList(sections.ALT_TEXT, 5),
    marketplaceSafeLanguage: splitPipeList(sections.MARKETPLACE_SAFE_LANGUAGE, 6),
    complianceSuggestions: splitPipeList(sections.COMPLIANCE_SUGGESTIONS, 6),
    packagingReminders: splitPipeList(sections.PACKAGING_REMINDERS, 5),
    sourcingReminders: splitPipeList(sections.SOURCING_REMINDERS, 5),
    safetyReminders: splitPipeList(sections.SAFETY_REMINDERS, 5),
    productRiskAlerts: splitPipeList(sections.PRODUCT_RISK_ALERTS, 5),
    platformOptimizationTips: splitPipeList(sections.PLATFORM_OPTIMIZATION_SUGGESTIONS, 6),
  });

  return parsed.success ? parsed.data : null;
}

export function parseStructuredListingOutput(raw: string) {
  const normalized = normalizeAiListingRaw(raw);
  if (!normalized) return null;

  const strictMatch =
    normalized.match(
      /TITLE:\s*([\s\S]*?)\n\s*BULLET_POINTS:\s*([\s\S]*?)\n\s*DESCRIPTION:\s*([\s\S]*?)\n\s*SEO_KEYWORDS:\s*([\s\S]*?)\n\s*EMOTIONAL_SEO_ANGLES:\s*([\s\S]*?)\n\s*CALL_TO_ACTION:\s*([\s\S]*?)\n\s*TAGS:\s*([\s\S]*?)\n\s*ALT_TEXT:\s*([\s\S]*?)\n\s*MARKETPLACE_SAFE_LANGUAGE:\s*([\s\S]*?)\n\s*COMPLIANCE_SUGGESTIONS:\s*([\s\S]*?)\n\s*PACKAGING_REMINDERS:\s*([\s\S]*?)\n\s*SOURCING_REMINDERS:\s*([\s\S]*?)\n\s*SAFETY_REMINDERS:\s*([\s\S]*?)\n\s*PRODUCT_RISK_ALERTS:\s*([\s\S]*?)\n\s*PLATFORM_OPTIMIZATION_SUGGESTIONS:\s*([\s\S]*?)\s*$/i,
    ) ?? null;

  if (strictMatch) {
    const fromStrict = tryParseFromCaptureGroups(strictMatch);
    if (fromStrict) return fromStrict;
  }

  return tryParseBySectionHeaders(normalized);
}
