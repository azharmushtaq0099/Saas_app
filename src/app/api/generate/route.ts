import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isMockMode } from "@/lib/mock-mode";
import { getMockAiOutput } from "@/lib/mock-state";
import { MOCK_PRO_COOKIE, MOCK_USAGE_COOKIE, isMockProCookie } from "@/lib/mock-session";
import { ensureUserRecord } from "@/lib/user-record";
import { buildComplianceGuidance } from "@/lib/compliance-guidance";
import { enforceSafeListingLanguage } from "@/features/compliance/safe-language-engine";
import { detectEtsyPolicyWarnings } from "@/features/compliance/etsy-policy-awareness-engine";
import { listingInputSchema } from "@/features/listing/schemas";
import { formatRawListingOutput } from "@/features/listing/services/raw-output";
import { generateListingOutput } from "@/features/listing/services/ai-generator";

export const runtime = "nodejs";

function getComplianceWarnings(text: string) {
  const riskyPatterns = [
    /\bnike\b/i,
    /\badidas\b/i,
    /\bpajama(s)?\b/i,
    /\bpj(s)?\b/i,
    /\bhttp\b/i,
    /\bwww\./i,
  ];
  const hasRisk = riskyPatterns.some((pattern) => pattern.test(text));
  return hasRisk
    ? ["This description may contain restricted terms. Please review before publishing."]
    : [];
}

function buildPolicyRiskInputText(input: {
  productTitle?: string;
  keywords?: string;
  productText?: string;
  productType?: string;
  material?: string;
  safetyConsiderations?: string;
}) {
  return [
    input.productTitle,
    input.keywords,
    input.productText,
    input.productType,
    input.material,
    input.safetyConsiderations,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: Request) {
  if (isMockMode) {
    const parsed = listingInputSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    if (
      !parsed.data.productTitle?.trim() &&
      !parsed.data.keywords?.trim() &&
      !parsed.data.productText?.trim() &&
      !parsed.data.imageDataUrl &&
      !parsed.data.productType?.trim()
    ) {
      return NextResponse.json(
        {
          error: "Provide product context (title, keywords, product type, text, or product image).",
        },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const isPro = isMockProCookie(cookieStore.get(MOCK_PRO_COOKIE)?.value);
    const usageRaw = cookieStore.get(MOCK_USAGE_COOKIE)?.value ?? "0";
    const currentUsage = Number.parseInt(usageRaw, 10);
    const used = Number.isFinite(currentUsage) && currentUsage >= 0 ? currentUsage : 0;
    const freeLimit = 3;
    if (!isPro && used >= freeLimit) {
      return NextResponse.json({ error: "Upgrade required" }, { status: 402 });
    }
    const nextUsed = used + 1;
    const remaining = isPro ? 999 : Math.max(0, freeLimit - nextUsed);

    const output = enforceSafeListingLanguage(getMockAiOutput());
    const complianceGuidance = buildComplianceGuidance(parsed.data, output);
    const raw = formatRawListingOutput(output);
    const policyWarnings = detectEtsyPolicyWarnings(`${buildPolicyRiskInputText(parsed.data)}\n${raw}`);
    const res = NextResponse.json({
      output,
      complianceGuidance,
      policyWarnings,
      raw,
      warnings: getComplianceWarnings(raw),
      usage: { used: nextUsed, remaining },
      user: { id: "mock-user", email: "demo@test.com", is_pro: isPro, usage_count: nextUsed },
    });
    res.cookies.set(MOCK_USAGE_COOKIE, String(nextUsed), { path: "/" });
    return res;
  }

  // Mock mode returns above; live path always uses the real SSR client (has `.rpc`).
  const supabase = (await createSupabaseServerClient()) as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = listingInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  if (
    !parsed.data.productTitle?.trim() &&
    !parsed.data.keywords?.trim() &&
    !parsed.data.productText?.trim() &&
    !parsed.data.imageDataUrl &&
    !parsed.data.productType?.trim()
  ) {
    return NextResponse.json(
      { error: "Provide product context (title, keywords, product type, text, or product image)." },
      { status: 400 },
    );
  }

  try {
    await ensureUserRecord(user.id, user.email);

    // Server-enforced usage tracking + paywall.
    const { data: usage, error: usageError } = await supabase.rpc("consume_generation", {
      limit_free: 3,
    });
    if (usageError) {
      return NextResponse.json({ error: "Usage tracking failed" }, { status: 500 });
    }
    if (!usage?.[0]?.allowed) {
      return NextResponse.json({ error: "Upgrade required" }, { status: 402 });
    }

    const output = await generateListingOutput(parsed.data, env.server.GEMINI_API_KEY);
    if (!output) {
      return NextResponse.json(
        { error: "AI response format error. Please regenerate." },
        { status: 502 },
      );
    }

    // Persist listing server-side (non-blocking for UX if storage fails)
    try {
      const admin = createSupabaseAdminClient();
      const { error: insertError } = await admin.from("listings").insert({
        user_id: user.id,
        input: parsed.data,
        output,
      });
      if (insertError) {
        console.error("/api/generate listing persist failed", insertError);
      }
    } catch (e) {
      console.error("/api/generate listing persist threw", e);
    }

    const raw = formatRawListingOutput(output);
    const policyWarnings = detectEtsyPolicyWarnings(`${buildPolicyRiskInputText(parsed.data)}\n${raw}`);

    return NextResponse.json({
      output,
      complianceGuidance: buildComplianceGuidance(parsed.data, output),
      policyWarnings,
      raw,
      warnings: getComplianceWarnings(raw),
      usage: { used: usage[0].used, remaining: usage[0].remaining },
    });
  } catch (e) {
    console.error("/api/generate live path error", e);
    return NextResponse.json(
      { error: "Unexpected server error. Please try again." },
      { status: 500 },
    );
  }
}

