import { ButtonLink } from "@/components/ui";
import { getUserOrThrow, getEntitlementForUser } from "@/lib/entitlements";
import { EbookReader } from "./ui";

export default async function EbookPage() {
  const user = await getUserOrThrow();
  const ent = await getEntitlementForUser(user.id);
  const isPro = ent.is_pro;

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-14 sm:py-16">
      {isPro ? (
        <EbookReader />
      ) : (
        <div className="premium-panel premium-surface-animated mx-auto mt-8 max-w-2xl p-8 sm:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            Pro unlock content
          </div>
          <h1 className="premium-display text-3xl font-semibold tracking-tight text-slate-900">
            SaaS Learning eBook
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This in-app guide is available for Pro users.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/pricing">Upgrade to Pro</ButtonLink>
            <ButtonLink href="/generator" variant="secondary">
              Back to generator
            </ButtonLink>
          </div>
        </div>
      )}
    </main>
  );
}
