"use client";

import { useMemo, useState } from "react";
import { EBOOK_CHAPTERS } from "@/lib/ebook-content";

export function EbookReader() {
  const [activeId, setActiveId] = useState<string>(EBOOK_CHAPTERS[0].id);
  const chapter = useMemo(
    () => EBOOK_CHAPTERS.find((c) => c.id === activeId) ?? EBOOK_CHAPTERS[0],
    [activeId],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="premium-panel premium-surface-animated h-fit p-5 lg:sticky lg:top-20">
        <h2 className="text-sm font-semibold text-slate-900">Guide Navigation</h2>
        <p className="mt-2 text-xs text-slate-500">For students aged 18-25</p>

        <div className="mt-5 hidden flex-col gap-2 lg:flex">
          {EBOOK_CHAPTERS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveId(c.id)}
              className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                c.id === chapter.id
                  ? "border-slate-300 bg-white text-slate-900 shadow-[0_16px_28px_-24px_rgba(15,23,42,0.45)]"
                  : "border-border bg-white/65 text-slate-600 hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        <div className="mt-5 lg:hidden">
          <select
            className="h-11 w-full rounded-xl border border-input bg-white/80 px-3 text-sm text-slate-900 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            value={chapter.id}
            onChange={(e) => setActiveId(e.target.value)}
          >
            {EBOOK_CHAPTERS.map((c) => (
              <option key={c.id} value={c.id} className="bg-background">
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </aside>

      <section className="premium-panel premium-surface-animated p-6 transition-all duration-300 hover:-translate-y-1 sm:p-10">
        <div className="mx-auto max-w-3xl animate-fade-in">
          <h1 className="premium-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            {chapter.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {chapter.summary}
          </p>

          <div className="mt-10 space-y-4 text-base leading-7 text-slate-700">
            {chapter.points.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-slate-200 bg-white/70 p-5 backdrop-blur-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Thinking Block
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700">
              {chapter.thinking.map((item, idx) => (
                <span key={item}>
                  [{item}]
                  {idx < chapter.thinking.length - 1 ? " → " : ""}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <a
              href="/ebook/download"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-900/80 bg-slate-900 px-5 text-sm font-semibold text-slate-50 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Download Full SaaS Guide (.docx)
            </a>
            <a
              href="/generator"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white/80 px-5 text-sm font-semibold text-slate-800 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              Back to generator
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
