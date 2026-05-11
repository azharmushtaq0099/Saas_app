import Link from "next/link";
import { DisclaimerNotice } from "@/components/disclaimers/DisclaimerNotice";

type LegalSection = {
  id: string;
  title: string;
  content: string[];
};

export function LegalPageTemplate({
  title,
  subtitle,
  updatedAt,
  sections,
}: {
  title: string;
  subtitle: string;
  updatedAt: string;
  sections: LegalSection[];
}) {
  return (
    <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
          Legal center
        </div>
        <h1 className="premium-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">{subtitle}</p>
        <p className="mt-2 text-xs text-slate-500">Last updated: {updatedAt}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <DisclaimerNotice
            variant="informational"
            title="Informational legal center"
            body="This legal center explains how to use the platform responsibly and does not replace independent legal review."
          />
          <DisclaimerNotice
            variant="marketplace-policy"
            title="Marketplace rules can evolve"
            body="Policy requirements may change by platform, category, and region. Verify current rules before relying on any guidance."
          />
        </div>

        <div className="mt-8 premium-card p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Jump to section
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="premium-card scroll-mt-24 p-6 sm:p-7">
              <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/85 p-4 text-sm text-slate-600">
          Questions about these terms? Contact{" "}
          <a className="font-medium text-slate-800 underline underline-offset-4" href="mailto:hello@listingstudio.ai">
            hello@listingstudio.ai
          </a>{" "}
          or return to{" "}
          <Link className="font-medium text-slate-800 underline underline-offset-4" href="/">
            homepage
          </Link>
          .
        </div>
      </div>
    </main>
  );
}
