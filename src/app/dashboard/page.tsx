import { ButtonLink } from "@/components/ui";
import { getEntitlementForUser, getUserOrThrow } from "@/lib/entitlements";

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <section className="dashboard-card p-5 sm:p-6" aria-label={label}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{detail}</p>
    </section>
  );
}

export default async function DashboardPage() {
  const user = await getUserOrThrow();
  const ent = await getEntitlementForUser(user.id);

  const isPro = Boolean(ent.is_pro);
  const freeLimit = 3;
  const remaining = isPro ? "Unlimited" : String(Math.max(0, freeLimit - ent.usage_count));
  const completion = isPro ? 100 : Math.min(100, Math.round((ent.usage_count / freeLimit) * 100));
  const onboardingReady = ent.usage_count > 0;

  return (
    <main className="app-shell flex-1 py-14 sm:py-20">
      <div className="dashboard-shell">
        <header className="dashboard-card p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Workspace overview
          </p>
          <h1 className="premium-display mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            A calm command center for listing performance, compliance-awareness workflow, and premium
            publishing quality.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/generator">Open generator</ButtonLink>
            <ButtonLink href="/account" variant="secondary">
              Account center
            </ButtonLink>
          </div>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Key metrics">
          <StatCard
            label="Plan"
            value={isPro ? "Pro Active" : "Free"}
            detail={isPro ? "Unlimited generation access." : "Upgrade when you need higher volume."}
          />
          <StatCard
            label="Generations used"
            value={String(ent.usage_count)}
            detail="Total listing guidance runs completed."
          />
          <StatCard
            label="Remaining"
            value={remaining}
            detail={isPro ? "No generation cap on your plan." : "Free credits before upgrade."}
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="dashboard-card p-6 sm:p-7">
            <h2 className="text-lg font-semibold text-slate-900">Generation capacity</h2>
            <p className="mt-2 text-sm text-slate-600">
              Track usage with a simple visual meter designed for quick planning.
            </p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden>
              <div
                className="h-full rounded-full bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500 transition-all duration-700 ease-out"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {isPro
                ? "Pro usage is not limited by generation count."
                : `${completion}% of free plan usage consumed.`}
            </p>
          </div>

          <div className="dashboard-card p-6 sm:p-7">
            <h2 className="text-lg font-semibold text-slate-900">Next best action</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {isPro
                ? "Continue refining listings with semantic SEO and policy-aware language."
                : "Move to Pro when you want uninterrupted optimization flow and expanded output volume."}
            </p>
            {!isPro ? (
              <div className="mt-6">
                <ButtonLink href="/pricing" className="w-full sm:w-auto">
                  Upgrade to Pro
                </ButtonLink>
              </div>
            ) : null}
          </div>
        </section>

        <section className="dashboard-card p-6 sm:p-8" aria-label="Onboarding status">
          <h2 className="text-lg font-semibold text-slate-900">Onboarding flow</h2>
          {!onboardingReady ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white/70 p-6">
              <p className="text-sm leading-relaxed text-slate-600">
                Your workspace is ready. Start with one guided generation to unlock personalized
                recommendations and compliance-awareness notes.
              </p>
              <div className="mt-5">
                <ButtonLink href="/generator" variant="secondary">
                  Start first generation
                </ButtonLink>
              </div>
            </div>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                "Define product context and buyer persona",
                "Generate listing with semantic SEO guidance",
                "Review compliance-awareness reminders before publishing",
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-4 text-sm text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

