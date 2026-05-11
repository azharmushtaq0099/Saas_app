"use client";

import { cx } from "@/components/ui";
import type { EtsyPolicyWarning, PolicyWarningSeverity } from "@/features/compliance/etsy-policy-awareness-engine";

const SEVERITY_STYLE: Record<
  PolicyWarningSeverity,
  {
    label: string;
    badgeClass: string;
    cardClass: string;
    dotClass: string;
  }
> = {
  low: {
    label: "Awareness",
    badgeClass: "bg-slate-100 text-slate-700",
    cardClass: "border-slate-200 bg-slate-50/70",
    dotClass: "bg-slate-500",
  },
  medium: {
    label: "Review suggested",
    badgeClass: "bg-amber-100 text-amber-700",
    cardClass: "border-amber-200 bg-amber-50/70",
    dotClass: "bg-amber-500",
  },
  high: {
    label: "Priority review",
    badgeClass: "bg-rose-100 text-rose-700",
    cardClass: "border-rose-200 bg-rose-50/70",
    dotClass: "bg-rose-500",
  },
};

function EducationalTooltip({ content }: { content: string }) {
  return (
    <span className="group relative inline-flex items-center">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-semibold text-slate-500">
        i
      </span>
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-600 opacity-0 shadow-[0_18px_35px_-24px_rgba(15,23,42,0.5)] transition-opacity duration-200 group-hover:opacity-100">
        {content}
      </span>
    </span>
  );
}

export function PolicyAwarenessPanel({ warnings }: { warnings: EtsyPolicyWarning[] }) {
  if (!warnings.length) return null;

  return (
    <div className="premium-card p-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Etsy policy awareness
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
          Educational guidance only
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Potentially risky wording detected. Consider refining language before publishing.
      </p>

      <div className="mt-4 space-y-3">
        {warnings.map((warning) => {
          const style = SEVERITY_STYLE[warning.severity];
          return (
            <article key={warning.id} className={cx("rounded-xl border p-4", style.cardClass)}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={cx("h-1.5 w-1.5 rounded-full", style.dotClass)} aria-hidden />
                  <h4 className="text-sm font-semibold text-slate-900">{warning.category}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cx(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em]",
                      style.badgeClass,
                    )}
                  >
                    {style.label}
                  </span>
                  <EducationalTooltip content={warning.educationalMessage} />
                </div>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-slate-700">{warning.concern}</p>
              <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Safer phrasing:</span>{" "}
                {warning.saferSuggestion}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
