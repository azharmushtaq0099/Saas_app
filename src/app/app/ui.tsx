"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button, CopyIcon, Input, Label } from "@/components/ui";
import { DisclaimerNotice } from "@/components/disclaimers/DisclaimerNotice";
import { PolicyAwarenessPanel } from "@/components/policy/PolicyAwarenessPanel";
import { useAppUser } from "@/contexts/AppUserContext";
import type { EtsyPolicyWarning } from "@/features/compliance/etsy-policy-awareness-engine";
import { getSeoInputWarnings } from "@/features/listing/engines/seo-engine";
import { getClarifyingOnboardingQuestions } from "@/features/listing/engines/onboarding-engine";

type Output = {
  title: string;
  bulletPoints: string[];
  description: string;
  seoKeywords: string[];
  emotionalSeoAngles: string[];
  callToAction: string;
  tags: string[];
  altText: string[];
  marketplaceSafeLanguage: string[];
  complianceSuggestions: string[];
  packagingReminders: string[];
  sourcingReminders: string[];
  safetyReminders: string[];
  productRiskAlerts: string[];
  platformOptimizationTips: string[];
};

type ComplianceGuidance = {
  disclaimer: string;
  overallRisk: "low" | "medium" | "high";
  riskBadges: Array<{ label: string; level: "low" | "medium" | "high"; reason: string }>;
  educationalCards: Array<{
    title: string;
    level: "low" | "medium" | "high";
    body: string;
    marketplaces: Array<"etsy" | "amazon" | "tiktok_shop" | "ebay">;
    region: string;
  }>;
  marketplaceNotices: string[];
  regionRecommendations: string[];
};

const MARKETPLACES = [
  { value: "etsy", label: "Etsy", icon: "🛍️" },
  { value: "amazon", label: "Amazon", icon: "📦" },
  { value: "tiktok_shop", label: "TikTok Shop", icon: "🎬" },
  { value: "ebay", label: "eBay", icon: "🏷️" },
] as const;

function CopyIconButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white/80 text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-slate-900"
    >
      <CopyIcon />
    </button>
  );
}

const panelClass =
  "premium-panel premium-surface-animated p-6 transition-all duration-300 sm:p-8 lg:p-9 hover:-translate-y-0.5";

const HIGH_RISK_CATEGORY_SIGNALS = [
  /\b(kid|kids|baby|babies|infant|toddler)\b/i,
  /\b(electronic|electronics|battery|charger|voltage)\b/i,
  /\b(cosmetic|cosmetics|skincare|fragrance|perfume)\b/i,
  /\b(supplement|supplements|vitamin|capsule)\b/i,
  /\b(wood|timber|oak|pine|walnut|bamboo)\b/i,
  /\b(chemical|regulated material|hazmat|solvent)\b/i,
  /\b(pet|dog|cat|animal)\b/i,
];

export function Generator({ isMockMode }: { isMockMode: boolean }) {
  const router = useRouter();
  const { refreshProfile } = useAppUser();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<Output | null>(null);
  const [raw, setRaw] = useState<string>("");
  const [usage, setUsage] = useState<{ used: number; remaining: number } | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [policyWarnings, setPolicyWarnings] = useState<EtsyPolicyWarning[]>([]);
  const [complianceGuidance, setComplianceGuidance] = useState<ComplianceGuidance | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<{
    platform: "etsy" | "amazon" | "tiktok_shop" | "ebay";
    productTitle: string;
    keywords: string;
    productText: string;
    productType: string;
    material: string;
    targetAudience: string;
    productStyle: string;
    emotionalPositioning: string;
    targetMarket: string;
    safetyConsiderations: string;
    productionStatus: "handmade" | "vintage" | "manufactured";
    imageDataUrl?: string;
  } | null>(null);
  const [inputWarnings, setInputWarnings] = useState<string[]>([]);
  const [humanReviewAccepted, setHumanReviewAccepted] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("human_review_acknowledged") === "true";
  });
  const [openMarketplaceNotices, setOpenMarketplaceNotices] = useState(true);
  const [openRegionNotices, setOpenRegionNotices] = useState(false);
  const [showHighRiskNotice, setShowHighRiskNotice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("human_review_acknowledged", humanReviewAccepted ? "true" : "false");
  }, [humanReviewAccepted]);

  async function fileToDataUrl(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(file);
    });
  }

  async function generate(payload: {
    platform: "etsy" | "amazon" | "tiktok_shop" | "ebay";
    productTitle: string;
    keywords: string;
    productText: string;
    productType: string;
    material: string;
    targetAudience: string;
    productStyle: string;
    emotionalPositioning: string;
    targetMarket: string;
    safetyConsiderations: string;
    productionStatus: "handmade" | "vintage" | "manufactured";
    imageDataUrl?: string;
  }) {
    setError(null);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => null)) as
      | {
          error?: string;
          output?: Output;
          complianceGuidance?: ComplianceGuidance;
          policyWarnings?: EtsyPolicyWarning[];
          raw?: string;
          warnings?: string[];
          usage?: { used: number; remaining: number };
        }
      | null;

    if (!res.ok) {
      const msg = data?.error ?? "Generation failed.";
      setError(msg);
      if (msg === "Upgrade required") {
        setShowUpgradeModal(true);
      }
      return;
    }

    setOutput(data?.output ?? null);
    setRaw(data?.raw ?? "");
    setWarnings(data?.warnings ?? []);
    setPolicyWarnings(data?.policyWarnings ?? []);
    setComplianceGuidance(data?.complianceGuidance ?? null);
    setUsage(data?.usage ?? null);
    const generatedText = JSON.stringify(data?.output ?? "").toLowerCase();
    const hasHighRiskSignal = HIGH_RISK_CATEGORY_SIGNALS.some((signal) => signal.test(generatedText));
    setShowHighRiskNotice(hasHighRiskSignal);
    await refreshProfile();
    if (typeof window !== "undefined" && data?.usage) {
      const currentRaw = localStorage.getItem("mock_user_state");
      const current = currentRaw ? JSON.parse(currentRaw) : {};
      localStorage.setItem(
        "mock_user_state",
        JSON.stringify({
          id: "mock-user",
          email: "demo@test.com",
          is_pro: Boolean(current?.is_pro),
          usage_count: data.usage.used,
        }),
      );
    }
  }

  function copy(text: string) {
    void navigator.clipboard.writeText(text);
  }

  function copyWithFeedback(key: string, text: string) {
    copy(text);
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((k) => (k === key ? null : k));
    }, 900);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:items-start">
        <form
          className={panelClass}
          action={async (fd) => {
            startTransition(async () => {
              setOutput(null);
              setRaw("");
              setWarnings([]);
              setPolicyWarnings([]);
              setComplianceGuidance(null);
              setInputWarnings([]);
              const platform = (String(fd.get("platform") ?? "etsy") || "etsy") as
                | "etsy"
                | "amazon"
                | "tiktok_shop"
                | "ebay";
              const productTitle = String(fd.get("productTitle") ?? "").trim();
              const keywords = String(fd.get("keywords") ?? "").trim();
              const productText = String(fd.get("productText") ?? "").trim();
              const productType = String(fd.get("productType") ?? "").trim();
              const material = String(fd.get("material") ?? "").trim();
              const targetAudience = String(fd.get("targetAudience") ?? "").trim();
              const productStyle = String(fd.get("productStyle") ?? "").trim();
              const emotionalPositioning = String(fd.get("emotionalPositioning") ?? "").trim();
              const targetMarket = String(fd.get("targetMarket") ?? "").trim();
              const safetyConsiderations = String(fd.get("safetyConsiderations") ?? "").trim();
              const productionStatus = (String(fd.get("productionStatus") ?? "handmade") ||
                "handmade") as "handmade" | "vintage" | "manufactured";
              const imageFile = fd.get("productImage") as File | null;
              const imageDataUrl =
                imageFile && imageFile.size > 0 ? await fileToDataUrl(imageFile) : undefined;

              const payload = {
                platform,
                productTitle,
                keywords,
                productText,
                productType,
                material,
                targetAudience,
                productStyle,
                emotionalPositioning,
                targetMarket,
                safetyConsiderations,
                productionStatus,
                imageDataUrl,
              };
              if (!productTitle && !keywords && !productType) {
                setInputWarnings([
                  "Please add a product title, keywords, or product type before generating.",
                ]);
                return;
              }
              if (!humanReviewAccepted) {
                setInputWarnings([
                  "Please confirm independent human verification before generating listing guidance.",
                ]);
                return;
              }
              const clarifyingQuestions = getClarifyingOnboardingQuestions(payload);
              if (clarifyingQuestions.length > 2) {
                setInputWarnings([
                  "Please answer a few clarifying onboarding questions before generation:",
                  ...clarifyingQuestions.slice(0, 4).map((question) => ` ${question}`),
                ]);
                return;
              }
              setInputWarnings(getSeoInputWarnings(payload));
              setLastPayload(payload);
              await generate(payload);
            });
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">AI onboarding</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Guided marketplace intake for stronger positioning and safer listings.
              </p>
            </div>
            {usage ? (
              <div className="shrink-0 rounded-xl border border-border bg-white/65 px-3 py-2 text-xs text-muted-foreground">
                <span className="text-slate-900">{usage.used}</span> used ·{" "}
                <span className="text-slate-900">{usage.remaining}</span> free left
              </div>
            ) : null}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="premium-card p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Step 1
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">Marketplace setup</div>
                <div className="mt-1 text-xs text-slate-600">Choose platform, region, and policy context.</div>
            </div>
            <div className="premium-card p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Step 2
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">Product intelligence</div>
              <div className="mt-1 text-xs text-slate-600">Add details AI needs to write premium copy.</div>
            </div>
            <div className="premium-card p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Step 3
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">Generate and optimize</div>
                <div className="mt-1 text-xs text-slate-600">Review modular output and verification reminders.</div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="platform">Marketplace</Label>
              <div className="premium-card grid gap-2 p-2 sm:grid-cols-2">
                {MARKETPLACES.map((marketplace) => (
                  <label
                    key={marketplace.value}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-colors hover:border-slate-300"
                  >
                    <input
                      type="radio"
                      id={marketplace.value}
                      name="platform"
                      value={marketplace.value}
                      defaultChecked={marketplace.value === "etsy"}
                    />
                    <span>{marketplace.icon}</span>
                    <span className="font-medium">{marketplace.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-white/76 p-5 sm:p-6">
              <div className="text-sm font-semibold text-slate-900">Intelligent onboarding</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Answer these to improve listing quality, policy awareness, and positioning.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Etsy-first MVP focus: cotton products (t-shirts, hoodies, socks, pants, scarves, vests)
                and wooden products (birdhouses, shelves, tables, cabinets, clocks, walking sticks,
                benches, doghouses).
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Clarifying onboarding answers are required for stronger SEO guidance and safer marketplace language.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="productType">Product type</Label>
                  <Input id="productType" name="productType" placeholder="e.g. wall art print" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input id="material" name="material" placeholder="e.g. cotton, walnut wood" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target audience</Label>
                  <Input id="targetAudience" name="targetAudience" placeholder="e.g. new moms" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productStyle">Product style</Label>
                  <Input id="productStyle" name="productStyle" placeholder="e.g. minimalist" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emotionalPositioning">Emotional positioning</Label>
                  <Input
                    id="emotionalPositioning"
                    name="emotionalPositioning"
                    placeholder="e.g. comforting and warm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetMarket">Target country/market</Label>
                  <Input id="targetMarket" name="targetMarket" placeholder="e.g. US, UK" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="productionStatus">Handmade / vintage / manufactured</Label>
                <select
                  id="productionStatus"
                  name="productionStatus"
                  defaultValue="handmade"
                  className="premium-select"
                >
                  <option value="handmade">Handmade</option>
                  <option value="vintage">Vintage</option>
                  <option value="manufactured">Manufactured</option>
                </select>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="safetyConsiderations">Safety considerations (optional)</Label>
                <textarea
                  id="safetyConsiderations"
                  name="safetyConsiderations"
                  className="min-h-20 w-full rounded-xl border border-input bg-white/90 px-3.5 py-3 text-sm text-foreground shadow-[0_10px_22px_-18px_rgba(15,23,42,0.38)] outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:border-slate-300 focus-visible:ring-2 focus-visible:ring-ring/60"
                  placeholder="e.g. small detachable parts, fragrance sensitivity, age guidance"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productTitle">Product title (or use keywords)</Label>
              <Input
                id="productTitle"
                name="productTitle"
                placeholder="e.g. Minimalist floral wall art print"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                name="keywords"
                placeholder="boho decor, neutral wall art, printable gift"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productText">Product text (optional if image uploaded)</Label>
              <textarea
                id="productText"
                name="productText"
                className="min-h-40 w-full rounded-xl border border-input bg-white/90 px-3.5 py-3 text-sm text-foreground shadow-[0_10px_22px_-18px_rgba(15,23,42,0.38)] outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:border-slate-300 focus-visible:ring-2 focus-visible:ring-ring/60"
                placeholder="Describe your product, audience, and key selling points..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productImage">Product image upload (optional)</Label>
              <label
                htmlFor="productImage"
                className="group flex cursor-pointer flex-col gap-1.5 rounded-xl border border-dashed border-border bg-white/65 p-4 transition-all duration-300 hover:border-slate-400 hover:bg-white"
              >
                <div className="text-sm font-medium text-slate-800">Upload an image</div>
                <div className="text-xs text-muted-foreground">
                  PNG/JPG supported. Drag & drop is optional — click to browse.
                </div>
                <Input
                  id="productImage"
                  name="productImage"
                  type="file"
                  accept="image/*"
                  className="mt-2 group-hover:border-slate-300"
                />
              </label>
              <p className="text-xs text-muted-foreground">Use product text OR image, or both.</p>
            </div>
          </div>

          {error ? (
            <div className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 backdrop-blur-sm">
              {error}
            </div>
          ) : null}
          {!error && warnings.length > 0 ? (
            <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700 backdrop-blur-sm">
              {warnings[0]}
            </div>
          ) : null}
          {!error && inputWarnings.length > 0 ? (
            <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700 backdrop-blur-sm">
              {inputWarnings.join(" ")}
            </div>
          ) : null}

          <div className="mt-6 space-y-3">
            <DisclaimerNotice
              variant="ai-limitation"
              title="AI output limitations"
              body="Regulations and marketplace rules can change without notice, and generated outputs can contain inaccuracies. Use these results as informational assistance only."
            />
            <DisclaimerNotice
              variant="compliance-awareness"
              title="Independent verification required"
              body="You remain responsible for confirming legal requirements, policy fit, and product claims in each destination region before commercial use."
            />
            <label className="mt-3 flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={humanReviewAccepted}
                onChange={(event) => setHumanReviewAccepted(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span>
                I understand AI-generated outputs require independent human verification before
                commercial or legal use.
              </span>
            </label>
          </div>

          <Button className="mt-6 h-12 w-full text-base" type="submit" loading={isPending}>
            {isPending ? "Generating..." : "Generate listing"}
          </Button>
        </form>

        <div className={panelClass}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Output</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Structured listing guidance.</p>
              <p className="mt-1 text-xs text-slate-500">
                Informational AI assistance only. Independent review required before publishing.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {output ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 gap-2"
                  onClick={() => copyWithFeedback("all", raw)}
                >
                  <CopyIcon />
                  {copiedKey === "all" ? "Copied" : "Copy all"}
                </Button>
              ) : null}
              {lastPayload ? (
                <Button
                  type="button"
                  loading={isPending}
                  disabled={isPending}
                  className="h-10"
                  onClick={() => {
                    startTransition(async () => {
                      await generate(lastPayload);
                    });
                  }}
                >
                  {isPending ? "Regenerating..." : "Regenerate"}
                </Button>
              ) : null}
            </div>
          </div>

          {isPending ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-4"
            >
              <div className="rounded-xl border border-border bg-white/65 px-4 py-3 text-sm text-muted-foreground">
                <span className="font-medium text-slate-900">Generating optimized listing</span>
                <span className="typing-dots" />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs text-slate-600">
                AI is mapping semantic SEO, marketplace policy language, and risk guidance.
              </div>
              <div className="skeleton-shimmer h-9 w-3/4 rounded-xl" />
              <div className="skeleton-shimmer h-24 w-full rounded-xl" />
              <div className="skeleton-shimmer h-32 w-full rounded-xl" />
              <div className="skeleton-shimmer h-24 w-full rounded-xl" />
              <div className="flex flex-wrap gap-2">
                <div className="skeleton-shimmer h-8 w-20 rounded-full" />
                <div className="skeleton-shimmer h-8 w-24 rounded-full" />
                <div className="skeleton-shimmer h-8 w-16 rounded-full" />
              </div>
            </motion.div>
          ) : !output ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-2xl border border-border bg-white/70 px-6 py-14 text-center text-sm text-muted-foreground backdrop-blur-sm"
            >
              <div className="mx-auto flex max-w-sm flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-sky-100 to-slate-200 blur-2xl" />
                  <div className="animate-float relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-white shadow-[0_16px_30px_-24px_rgba(15,23,42,0.5)]">
                    <span className="text-xl">✦</span>
                  </div>
                </div>
                <div className="mt-5 text-base font-semibold text-slate-900">
                  Your AI-generated listing will appear here
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Generate once — then copy, refine, and ship faster.
                </div>
                <div className="skeleton-shimmer mt-6 h-2.5 w-48 rounded-full opacity-70" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6"
            >
              <DisclaimerNotice
                variant="ai-limitation"
                title="AI-assisted educational guidance"
                body="These outputs are recommendations and may not reflect the latest regional laws or marketplace policy changes. Verify every critical statement before use."
              />

              {showHighRiskNotice ? (
                <DisclaimerNotice
                  variant="compliance-awareness"
                  title="Additional compliance attention suggested"
                  body="This draft appears related to higher-scrutiny product categories. Additional regional safety requirements may apply, and independent compliance verification is recommended."
                />
              ) : null}

              <PolicyAwarenessPanel warnings={policyWarnings} />

              <div className="premium-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Title
                  </div>
                  <div className="flex items-center gap-2">
                    {copiedKey === "title" ? (
                      <span className="text-xs font-medium text-slate-700">Copied</span>
                    ) : null}
                    <CopyIconButton
                      label="Copy title"
                      onClick={() => copyWithFeedback("title", output.title)}
                    />
                  </div>
                </div>
                <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl sm:leading-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 bg-clip-text text-transparent">
                    {output.title}
                  </span>
                </h3>
              </div>

              {output.bulletPoints.length ? (
                <div className="premium-card p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Bullet points
                    </div>
                    <div className="flex items-center gap-2">
                      {copiedKey === "bullets" ? (
                        <span className="text-xs font-medium text-slate-700">Copied</span>
                      ) : null}
                      <CopyIconButton
                        label="Copy bullet points"
                        onClick={() =>
                          copyWithFeedback("bullets", output.bulletPoints.join("\n"))
                        }
                      />
                    </div>
                  </div>
                  <ul className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700">
                    {output.bulletPoints.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3"
                        style={{ animationDelay: `${Math.min(220, idx * 55)}ms` }}
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500"
                          aria-hidden
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="premium-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Description
                  </div>
                  <div className="flex items-center gap-2">
                    {copiedKey === "desc" ? (
                      <span className="text-xs font-medium text-slate-700">Copied</span>
                    ) : null}
                    <CopyIconButton
                      label="Copy description"
                      onClick={() => copyWithFeedback("desc", output.description)}
                    />
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-slate-700">
                  {output.description}
                </p>
              </div>

              {output.callToAction ? (
                <div className="premium-card p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Call to action
                    </div>
                    <div className="flex items-center gap-2">
                      {copiedKey === "cta" ? (
                        <span className="text-xs font-medium text-slate-700">Copied</span>
                      ) : null}
                      <CopyIconButton
                        label="Copy call to action"
                        onClick={() => copyWithFeedback("cta", output.callToAction ?? "")}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-base font-semibold text-slate-900">{output.callToAction}</p>
                </div>
              ) : null}

              <div className="premium-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Tags
                  </div>
                  <div className="flex items-center gap-2">
                    {copiedKey === "tags" ? (
                      <span className="text-xs font-medium text-slate-700">Copied</span>
                    ) : null}
                    <CopyIconButton
                      label="Copy tags"
                      onClick={() => copyWithFeedback("tags", output.tags.join(" | "))}
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {output.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="premium-card p-6">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Emotional SEO angles
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {output.emotionalSeoAngles.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="premium-card p-6">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Image alt text suggestions
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {output.altText.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="premium-card p-6">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Marketplace-safe language
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {output.marketplaceSafeLanguage.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="premium-card p-6">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Compliance suggestions
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {output.complianceSuggestions.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="premium-card p-6">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Packaging reminders
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {output.packagingReminders.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="premium-card p-6">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Sourcing reminders
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {output.sourcingReminders.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="premium-card p-6">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Safety reminders
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {output.safetyReminders.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="premium-card p-5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Product risk alerts
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {output.productRiskAlerts.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="premium-card p-5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Platform optimization suggestions
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {output.platformOptimizationTips.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              {complianceGuidance ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 backdrop-blur-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Compliance awareness (informational)
                  </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        complianceGuidance.overallRisk === "high"
                          ? "bg-red-100 text-red-700"
                          : complianceGuidance.overallRisk === "medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      Overall risk: {complianceGuidance.overallRisk}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {complianceGuidance.riskBadges.map((badge) => (
                      <span
                        key={`${badge.label}-${badge.reason}`}
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          badge.level === "high"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : badge.level === "medium"
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}
                        title={badge.reason}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {complianceGuidance.educationalCards.map((card) => (
                      <div
                        key={`${card.title}-${card.region}`}
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm font-semibold text-slate-900">{card.title}</div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              card.level === "high"
                                ? "bg-red-100 text-red-700"
                                : card.level === "medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {card.level}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.body}</p>
                        <div className="mt-3 text-xs text-slate-500">
                          Region: {card.region} · Marketplaces: {card.marketplaces.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <button
                        type="button"
                        className="w-full text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                        onClick={() => setOpenMarketplaceNotices((s) => !s)}
                      >
                        Marketplace policy notes {openMarketplaceNotices ? "−" : "+"}
                      </button>
                      {openMarketplaceNotices ? (
                        <ul className="mt-2 space-y-2 text-sm text-slate-700">
                          {complianceGuidance.marketplaceNotices.map((note) => (
                            <li key={note}>- {note}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <button
                        type="button"
                        className="w-full text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                        onClick={() => setOpenRegionNotices((s) => !s)}
                      >
                        Regional verification reminders {openRegionNotices ? "−" : "+"}
                      </button>
                      {openRegionNotices ? (
                        <ul className="mt-2 space-y-2 text-sm text-slate-700">
                          {complianceGuidance.regionRecommendations.map((note) => (
                            <li key={note}>- {note}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>

                  <p className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                    {complianceGuidance.disclaimer}
                  </p>
                </div>
              ) : null}
            </motion.div>
          )}
        </div>
      </div>

      {showUpgradeModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-md">
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-white/90 p-6 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upgrade-modal-title"
          >
            <h3 id="upgrade-modal-title" className="text-lg font-semibold tracking-tight text-slate-900">
              Upgrade required
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You have reached the free limit (3 generations). Upgrade to Pro for unlimited access.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                variant="secondary"
                className="h-11 flex-1"
              >
                Close
              </Button>
              <Button
                type="button"
                loading={isCheckoutPending}
                disabled={isCheckoutPending}
                onClick={async () => {
                  setIsCheckoutPending(true);
                  try {
                    const res = await fetch("/api/stripe/checkout", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({}),
                      credentials: "same-origin",
                    });
                    const data = (await res.json().catch(() => null)) as
                      | { url?: string; error?: string }
                      | null;
                    if (!res.ok) {
                      return;
                    }
                    if (isMockMode) {
                      await refreshProfile();
                      router.refresh();
                      setShowUpgradeModal(false);
                      return;
                    }
                    if (data?.url) {
                      window.location.href = data.url;
                    }
                  } finally {
                    setIsCheckoutPending(false);
                  }
                }}
                className="h-11 flex-1"
              >
                {isCheckoutPending ? "Redirecting..." : "Upgrade with Stripe"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
