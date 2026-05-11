"use client";

import { ButtonLink } from "@/components/ui";

export function PremiumHero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="app-shell grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/75 px-3 py-1 text-xs text-slate-600 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
            AI-powered Etsy workflow
          </div>
          <h1 className="premium-display text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Design-quality listing copy for modern Etsy sellers.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Generate premium titles, descriptions, and Etsy-ready SEO with educational compliance
            awareness for cotton and wooden product listings.
          </p>
          <div className="mt-11 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/signup" className="h-11 px-6">
              Start free
            </ButtonLink>
            <ButtonLink href="/pricing" variant="secondary" className="h-11 px-6">
              View pricing
            </ButtonLink>
          </div>
        </div>

        <div className="premium-panel premium-surface-animated p-7 sm:p-9">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Preview
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white/84 p-6 shadow-[0_18px_36px_-26px_rgba(15,23,42,0.32)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Generated title
            </div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
              Neutral Botanical Printable Wall Art Set
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Thoughtfully crafted copy tuned for Etsy search intent, with clarity and conversion
              balance.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["minimalist decor", "printable gift", "modern wall art"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-5 text-sm text-slate-600">
            Built for modern Etsy operators with calm UX, safe-language prompts, and enterprise-grade
            modular architecture.
          </div>
        </div>
      </div>
    </section>
  );
}
