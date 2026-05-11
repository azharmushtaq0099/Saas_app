"use client";

import { ButtonLink } from "@/components/ui";
import { useAppUser } from "@/contexts/AppUserContext";

export function GeneratorPlanBanner({ initialIsPro }: { initialIsPro: boolean }) {
  const { profile } = useAppUser();
  const isPro = profile?.is_pro ?? initialIsPro;

  if (!isPro) {
    return (
      <div className="rounded-2xl border border-border bg-white/80 p-5 text-left shadow-[0_18px_34px_-24px_rgba(15,23,42,0.4)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 sm:p-6 lg:text-left">
        <div className="font-semibold text-slate-900">Free plan</div>
        <div className="mt-2 text-sm text-muted-foreground">3 generations max.</div>
        <div className="mt-4">
          <ButtonLink href="/pricing" className="w-full sm:w-auto">
            Upgrade to Pro
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-panel premium-surface-animated p-5 text-left sm:p-6">
      <div className="font-semibold text-slate-900">Pro Active</div>
      <div className="mt-2 text-sm text-slate-600">Higher limits + eBook access.</div>
    </div>
  );
}
