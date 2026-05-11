import { ButtonLink } from "@/components/ui";
import { CheckoutButtons } from "./ui";
import { isMockMode } from "@/lib/mock-mode";

export default function PricingPage() {
  return (
    <main className="app-shell flex-1 py-16 sm:py-20">
      <div className="max-w-2xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
          One-time pricing
        </div>
        <h1 className="premium-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Pricing
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          One tool, one outcome: better Etsy listings. Upgrade to Pro for higher limits and the
          learning eBook.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="premium-panel p-8 transition-all duration-300 hover:-translate-y-1">
          <div className="text-sm font-semibold text-slate-900">Free</div>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">$0</div>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-slate-600">
            <li className="flex gap-2">
              <span className="text-slate-700">✓</span>
              3 generations/day
            </li>
            <li className="flex gap-2">
              <span className="text-slate-700">✓</span>
              Save generated listings
            </li>
            <li className="flex gap-2">
              <span className="text-slate-700">✓</span>
              Basic access
            </li>
          </ul>
          <div className="mt-8">
            <ButtonLink href="/signup" variant="secondary" className="w-full sm:w-auto">
              Create account
            </ButtonLink>
          </div>
        </div>

        <div className="premium-panel premium-surface-animated relative p-8 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute right-6 top-6 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
            Popular
          </div>
          <div className="text-sm font-semibold text-slate-900">Pro</div>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">$20</div>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-slate-600">
            <li className="flex gap-2">
              <span className="text-slate-700">✓</span>
              Unlimited generations
            </li>
            <li className="flex gap-2">
              <span className="text-slate-700">✓</span>
              Pro-only eBook access
            </li>
            <li className="flex gap-2">
              <span className="text-slate-700">✓</span>
              One-time unlock via Stripe
            </li>
          </ul>
          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            <CheckoutButtons isMockMode={isMockMode} />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Configure Stripe price IDs in `.env`.</p>
        </div>
      </div>
    </main>
  );
}
