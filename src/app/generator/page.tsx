import { getEntitlementForUser, getUserOrThrow } from "@/lib/entitlements";
import { GeneratorPlanBanner } from "@/components/GeneratorPlanBanner";
import { isMockMode } from "@/lib/mock-mode";

import { Generator } from "../app/ui";

export default async function GeneratorPage() {
  const user = await getUserOrThrow();
  const ent = await getEntitlementForUser(user.id);

  const isPro = Boolean(ent.is_pro);

  return (
    <div className="app-shell flex-1 py-14 sm:py-20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            Production generator
          </div>
          <h1 className="premium-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Etsy AI Listing Studio
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            AI-assisted listing optimization for Etsy sellers, with educational compliance awareness and
            premium semantic SEO guidance.
          </p>
        </div>
        <div className="shrink-0 lg:max-w-sm lg:text-right">
          <GeneratorPlanBanner initialIsPro={isPro} />
        </div>
      </div>

      <div className="mt-10 sm:mt-12">
        <Generator isMockMode={isMockMode} />
      </div>
    </div>
  );
}
