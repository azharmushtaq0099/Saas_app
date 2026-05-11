import { ButtonLink } from "@/components/ui";
import { getEntitlementForUser, getUserOrThrow } from "@/lib/entitlements";

export default async function AccountPage({
  searchParams,
}: {
  searchParams?: Promise<{ checkout?: string }>;
}) {
  const user = await getUserOrThrow();
  const ent = await getEntitlementForUser(user.id);
  const params = (await searchParams) ?? {};

  const isPro = Boolean(ent.is_pro);
  const freeLimit = 3;
  const usagePercent = isPro ? 100 : Math.min(100, Math.round((ent.usage_count / freeLimit) * 100));

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-16 sm:py-20">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
        Account center
      </div>
      <h1 className="premium-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
        Account
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Check your plan, usage, and billing access.
      </p>
      {params.checkout === "success" ? (
        <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 backdrop-blur-sm">
          Upgrade successful. Your Pro access is now active.
        </div>
      ) : null}

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="premium-panel premium-surface-animated p-6 transition-all duration-300 hover:-translate-y-1 sm:p-8">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500">Signed in as</div>
          <div className="mt-2 text-sm font-semibold text-slate-900">{user.email}</div>

          <div className="mt-8 rounded-xl border border-border bg-white/70 p-5 backdrop-blur-sm">
            <div className="font-medium text-slate-900">Plan status</div>
            <div className="mt-2 text-muted-foreground">{isPro ? "Pro (active)" : "Free"}</div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-accent">
              <div
                className="h-full rounded-full bg-gradient-to-r from-slate-700 to-slate-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Total generations used: {ent.usage_count}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {!isPro ? <ButtonLink href="/pricing">Upgrade</ButtonLink> : null}
            <ButtonLink href="/ebook.docx" variant="secondary">
              Download eBook
            </ButtonLink>
          </div>
        </div>

        <div className="premium-panel premium-surface-animated p-6 transition-all duration-300 hover:-translate-y-1 sm:p-8">
          <div className="text-lg font-semibold text-slate-900">Next steps</div>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-slate-600">
            <li className="flex gap-3">
              <span className="text-slate-500">→</span>
              Generate listings in the app.
            </li>
            <li className="flex gap-3">
              <span className="text-slate-500">→</span>
              Upgrade to Pro for higher limits.
            </li>
            <li className="flex gap-3">
              <span className="text-slate-500">→</span>
              Download the learning eBook (Pro).
            </li>
          </ul>
          <div className="mt-8">
            <ButtonLink href="/generator" variant="secondary">
              Open generator
            </ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}
