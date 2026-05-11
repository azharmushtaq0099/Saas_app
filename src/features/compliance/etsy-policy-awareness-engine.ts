export type PolicyWarningSeverity = "low" | "medium" | "high";

export type EtsyPolicyWarning = {
  id: string;
  severity: PolicyWarningSeverity;
  category: string;
  concern: string;
  educationalMessage: string;
  saferSuggestion: string;
};

type Rule = {
  id: string;
  severity: PolicyWarningSeverity;
  category: string;
  patterns: RegExp[];
  concern: string;
  educationalMessage: string;
  saferSuggestion: string;
};

const POLICY_RULES: Rule[] = [
  {
    id: "medical-claims",
    severity: "high",
    category: "Medical claims",
    patterns: [/\b(cures?|heals?|treats?|therapeutic|medicinal)\b/i],
    concern: "Medical or treatment-style claims can create high policy risk in marketplace listings.",
    educationalMessage: "Consider reviewing Etsy prohibited items policy regarding medical claims.",
    saferSuggestion: "Describe comfort, feel, or atmosphere benefits without disease-treatment language.",
  },
  {
    id: "disease-claims",
    severity: "high",
    category: "Disease references",
    patterns: [/\b(anxiety|depression|disease|arthritis|eczema|insomnia|pain relief)\b/i],
    concern: "Disease-related wording may imply unverified health outcomes.",
    educationalMessage: "Please ensure product copy avoids disease-targeting claims unless fully compliant.",
    saferSuggestion: "Use neutral wellness wording such as calming, cozy, or soothing atmosphere.",
  },
  {
    id: "anti-inflammatory",
    severity: "high",
    category: "Anti-inflammatory wording",
    patterns: [/\banti[- ]inflammatory\b/i],
    concern: "Anti-inflammatory language can be interpreted as a medical efficacy claim.",
    educationalMessage: "You may need to replace anti-inflammatory wording with non-medical descriptors.",
    saferSuggestion: "Use phrasing like cooling skincare massage roller or comfort-focused routine tool.",
  },
  {
    id: "controlled-substances",
    severity: "high",
    category: "CBD/THC or drug references",
    patterns: [/\b(cbd|thc|cannabis|marijuana|drug[- ]?infused|psychoactive)\b/i],
    concern: "Controlled-substance references can trigger strict marketplace restrictions.",
    educationalMessage: "Consider verifying Etsy policy on CBD, THC, and drug-related references.",
    saferSuggestion: "Focus on scent profile, texture, or craft quality without controlled-substance mentions.",
  },
  {
    id: "weapons",
    severity: "high",
    category: "Weapons content",
    patterns: [/\b(weapon|firearm|gun|rifle|ammo|knife|dagger|explosive)\b/i],
    concern: "Weapons or weapon-adjacent language can violate prohibited-item rules.",
    educationalMessage: "Please ensure listing language does not market dangerous weapons.",
    saferSuggestion: "Describe decor, cosplay prop style, or collector display context only where permitted.",
  },
  {
    id: "weapon-replica",
    severity: "high",
    category: "Realistic weapon replicas",
    patterns: [/\b(realistic replica|replica firearm|imitation gun)\b/i],
    concern: "Realistic replica references may fall into restricted or prohibited categories.",
    educationalMessage: "You may need to review policy for replicas that resemble real weapons.",
    saferSuggestion: "Use non-weapon framing and avoid realism claims that imply dangerous use.",
  },
  {
    id: "hate-content",
    severity: "high",
    category: "Hate content",
    patterns: [/\b(hate|racial slur|extremist|nazi|white power)\b/i],
    concern: "Hate-oriented content is typically restricted or prohibited.",
    educationalMessage: "Consider reviewing Etsy policies related to hateful or extremist content.",
    saferSuggestion: "Use inclusive, respectful language and remove discriminatory wording.",
  },
  {
    id: "counterfeit-ip",
    severity: "high",
    category: "Counterfeit or trademark misuse",
    patterns: [/\b(gucci|louis vuitton|nike|adidas|disney|harry potter|replica brand|dupe)\b/i],
    concern: "Brand references can indicate IP/trademark risk if unauthorized.",
    educationalMessage: "Please ensure all brand and trademark usage is authorized.",
    saferSuggestion: "Use original descriptors and generic style terms without protected brand names.",
  },
  {
    id: "fake-documents",
    severity: "high",
    category: "Fake documents",
    patterns: [/\b(fake id|counterfeit passport|forged|fake certificate)\b/i],
    concern: "Fake document language is generally prohibited.",
    educationalMessage: "Consider removing any references to falsified or forged documentation.",
    saferSuggestion: "If relevant, describe novelty or educational printables without official-document claims.",
  },
  {
    id: "children-safety",
    severity: "medium",
    category: "Unsafe children product language",
    patterns: [/\b(baby toy|infant toy|kids toy|for toddlers)\b/i],
    concern: "Children-oriented wording raises higher safety-review expectations.",
    educationalMessage: "Please ensure age guidance and safety language are explicit and accurate.",
    saferSuggestion: "Add clear age ranges, supervision reminders, and material details.",
  },
  {
    id: "choking-hazard",
    severity: "high",
    category: "Choking hazard risk",
    patterns: [/\b(small parts?|choking)\b/i],
    concern: "Small-part context may require clear warnings for child safety.",
    educationalMessage: "Consider verifying child-safety labeling expectations for small detachable parts.",
    saferSuggestion: "Use clear age guidance and safety caution wording in description and packaging notes.",
  },
  {
    id: "unsafe-baby-products",
    severity: "high",
    category: "Unsafe baby product claims",
    patterns: [/\b(sleep positioner|crib bumper|newborn sleep aid)\b/i],
    concern: "Certain baby product categories may face strict safety restrictions.",
    educationalMessage: "You may need additional review for baby-related safety-sensitive categories.",
    saferSuggestion: "Use neutral nursery decor phrasing and avoid implied safety guarantees.",
  },
  {
    id: "prohibited-fur",
    severity: "medium",
    category: "Prohibited fur references",
    patterns: [/\b(real fur|animal fur|mink|fox fur)\b/i],
    concern: "Real fur references may trigger policy or regional restrictions.",
    educationalMessage: "Consider reviewing Etsy and destination-market guidance on fur-related products.",
    saferSuggestion: "Use faux-fur or texture-inspired wording when accurate.",
  },
  {
    id: "violence-glorification",
    severity: "high",
    category: "Violence glorification",
    patterns: [/\b(kill|murder|bloodthirsty|violent revenge|execute)\b/i],
    concern: "Violence-glorifying language can conflict with platform safety standards.",
    educationalMessage: "Please ensure listing language avoids violent or harm-promoting framing.",
    saferSuggestion: "Use neutral dramatic-theme wording without explicit harm glorification.",
  },
];

export function detectEtsyPolicyWarnings(text: string): EtsyPolicyWarning[] {
  const normalized = text.toLowerCase();
  return POLICY_RULES.filter((rule) => rule.patterns.some((pattern) => pattern.test(normalized))).map(
    (rule) => ({
      id: rule.id,
      severity: rule.severity,
      category: rule.category,
      concern: rule.concern,
      educationalMessage: rule.educationalMessage,
      saferSuggestion: rule.saferSuggestion,
    }),
  );
}
