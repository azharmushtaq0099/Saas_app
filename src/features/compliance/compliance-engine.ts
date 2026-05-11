import "server-only";

type RiskLevel = "low" | "medium" | "high";
type Marketplace = "etsy" | "amazon" | "tiktok_shop" | "ebay";
type ProductionStatus = "handmade" | "vintage" | "manufactured";

type InputContext = {
  platform: Marketplace;
  productType?: string;
  material?: string;
  targetMarket?: string;
  safetyConsiderations?: string;
  productionStatus?: ProductionStatus;
};

type OutputContext = {
  productRiskAlerts: string[];
};

export type ComplianceBadge = {
  label: string;
  level: RiskLevel;
  reason: string;
};

export type ComplianceEducationalCard = {
  title: string;
  level: RiskLevel;
  body: string;
  marketplaces: Marketplace[];
  region: string;
};

export type ComplianceGuidance = {
  disclaimer: string;
  overallRisk: RiskLevel;
  riskBadges: ComplianceBadge[];
  educationalCards: ComplianceEducationalCard[];
  marketplaceNotices: string[];
  regionRecommendations: string[];
};

function inferRegion(targetMarket?: string) {
  const market = (targetMarket ?? "").toLowerCase();
  if (/\b(eu|europe|germany|france|italy|spain|netherlands|sweden)\b/.test(market)) return "EU";
  if (/\b(uk|united kingdom|britain)\b/.test(market)) return "UK";
  if (/\b(us|usa|united states|america)\b/.test(market)) return "US";
  return "Global";
}

function getMarketplaceNotices(platform: Marketplace): string[] {
  if (platform === "amazon") {
    return [
      "Use factual, verifiable product claims and avoid unsupported superlatives.",
      "Keep safety and material details consistent with listing attributes and images.",
    ];
  }
  if (platform === "tiktok_shop") {
    return [
      "Use concise safety-forward copy suitable for short-form discovery traffic.",
      "Avoid sensitive or exaggerated claims that can trigger moderation review.",
    ];
  }
  if (platform === "ebay") {
    return [
      "Clearly disclose product condition, included parts, and any material limitations.",
      "Keep listing statements consistent with photos and item specifics.",
    ];
  }
  return [
    "Use transparent handmade/vintage/manufactured language that reflects the real product.",
    "Avoid brand references or claims that cannot be substantiated in your listing details.",
  ];
}

export function buildComplianceGuidance(input: InputContext, output: OutputContext): ComplianceGuidance {
  const region = inferRegion(input.targetMarket);
  const material = (input.material ?? "").toLowerCase();
  const productType = (input.productType ?? "").toLowerCase();
  const safety = (input.safetyConsiderations ?? "").toLowerCase();
  const riskBadges: ComplianceBadge[] = [];
  const educationalCards: ComplianceEducationalCard[] = [];
  const regionRecommendations: string[] = [];
  const marketplaceNotices = getMarketplaceNotices(input.platform);

  const safetySignals = [safety, productType, material].join(" ");
  const childRisk = /\b(child|kid|baby|infant|toddler|toy)\b/.test(safetySignals);
  const chokingRisk = /\b(small part|choking|bead|magnet)\b/.test(safetySignals);
  const timberRisk = /\bwood|timber|oak|walnut|pine|bamboo\b/.test(material);
  const electronicsRisk = /\b(electronic|electronics|battery|charger|voltage)\b/.test(safetySignals);
  const cosmeticsRisk = /\b(cosmetic|cosmetics|skincare|fragrance|perfume)\b/.test(safetySignals);
  const supplementRisk = /\b(supplement|supplements|vitamin|capsule)\b/.test(safetySignals);
  const regulatedMaterialsRisk = /\b(chemical|solvent|hazmat|regulated material)\b/.test(safetySignals);
  const petRisk = /\b(pet|dog|cat|animal)\b/.test(safetySignals);

  if (childRisk || chokingRisk) {
    riskBadges.push({
      label: "Child Safety",
      level: "high",
      reason: "Potential child-oriented use needs visible choking-hazard and age guidance.",
    });
    educationalCards.push({
      title: "CPSIA awareness",
      level: "high",
      body: "For child-appeal items, include age guidance, small-part warnings, and clear material disclosure. Treat this as educational AI guidance only.",
      marketplaces: ["etsy", "amazon", "tiktok_shop", "ebay"],
      region: "US",
    });
  }

  if (timberRisk && region === "EU") {
    riskBadges.push({
      label: "Timber Sourcing",
      level: "medium",
      reason: "EU-targeted wood/timber products may need origin and traceability checks.",
    });
    educationalCards.push({
      title: "EUDR timber awareness",
      level: "medium",
      body: "For wood-derived products sold in EU markets, maintain source and supply-chain records where possible. This is an AI reminder, not legal validation.",
      marketplaces: ["etsy", "amazon", "tiktok_shop", "ebay"],
      region: "EU",
    });
  }

  if (electronicsRisk || cosmeticsRisk || supplementRisk || regulatedMaterialsRisk || petRisk) {
    riskBadges.push({
      label: "Category Sensitivity",
      level: "medium",
      reason: "Some product categories can face additional regional and marketplace review requirements.",
    });
    educationalCards.push({
      title: "High-scrutiny category awareness",
      level: "medium",
      body: "Additional regional safety requirements may apply. Use this as informational guidance and complete independent compliance verification before publication.",
      marketplaces: ["etsy", "amazon", "tiktok_shop", "ebay"],
      region: "Global",
    });
  }

  if (input.productionStatus === "handmade") {
    riskBadges.push({
      label: "Authenticity",
      level: "low",
      reason: "Handmade claims should match process transparency and listing photos.",
    });
    educationalCards.push({
      title: "Handmade authenticity reminder",
      level: "low",
      body: "Describe your making process clearly and avoid overclaiming artisanal steps not actually performed.",
      marketplaces: ["etsy", "amazon", "tiktok_shop", "ebay"],
      region: "Global",
    });
  }

  educationalCards.push({
    title: "CE marking suggestion",
    level: "medium",
    body: "If your product category requires CE in your selling region, confirm applicable directives before claiming CE-ready language.",
    marketplaces: ["amazon", "ebay", "tiktok_shop", "etsy"],
    region: "EU",
  });
  educationalCards.push({
    title: "Packaging and EPR awareness",
    level: "medium",
    body: "Some regions require packaging compliance and producer responsibility records. Maintain packaging material notes and supplier references.",
    marketplaces: ["amazon", "ebay", "etsy", "tiktok_shop"],
    region: "EU/UK",
  });
  educationalCards.push({
    title: "Material traceability reminder",
    level: "medium",
    body: "Keep supplier and material details organized so your listing claims remain auditable and consistent.",
    marketplaces: ["etsy", "amazon", "tiktok_shop", "ebay"],
    region: "Global",
  });

  if (region === "EU") {
    regionRecommendations.push(
      "Review CE applicability and category-specific conformity requirements for EU destination markets.",
      "Maintain packaging/EPR and material sourcing records for audit readiness.",
    );
  } else if (region === "US") {
    regionRecommendations.push(
      "For child-oriented items, prioritize CPSIA-style warning language and age-appropriate labeling.",
      "Keep product claims factual and avoid health/safety assurances you cannot verify.",
    );
  } else {
    regionRecommendations.push(
      "Adapt hazard and material disclosure language to your destination market rules before publishing.",
      "Preserve supplier and packaging records to support future compliance checks.",
    );
  }

  if (childRisk || electronicsRisk || cosmeticsRisk || supplementRisk || regulatedMaterialsRisk || petRisk) {
    regionRecommendations.push(
      "Marketplace approval requirements vary by region and category.",
      "Use independent human review before commercial publication.",
    );
  }

  if (output.productRiskAlerts.length > 0) {
    riskBadges.push({
      label: "AI Detected Risk",
      level: "medium",
      reason: output.productRiskAlerts[0],
    });
  }

  const overallRisk: RiskLevel = riskBadges.some((b) => b.level === "high")
    ? "high"
    : riskBadges.some((b) => b.level === "medium")
      ? "medium"
      : "low";

  return {
    disclaimer:
      "AI-generated compliance guidance for informational and educational purposes only. Regulations and marketplace rules can change, and this does not provide legal advice, certification, or marketplace approval assurances.",
    overallRisk,
    riskBadges,
    educationalCards,
    marketplaceNotices,
    regionRecommendations,
  };
}
