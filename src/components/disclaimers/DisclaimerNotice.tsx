import { cx } from "@/components/ui";

export type DisclaimerVariant =
  | "informational"
  | "compliance-awareness"
  | "ai-limitation"
  | "marketplace-policy";

const VARIANT_STYLES: Record<
  DisclaimerVariant,
  {
    badge: string;
    badgeClass: string;
    cardClass: string;
  }
> = {
  informational: {
    badge: "Informational guidance",
    badgeClass: "bg-slate-100 text-slate-700",
    cardClass: "border-slate-200 bg-slate-50/70",
  },
  "compliance-awareness": {
    badge: "Compliance awareness",
    badgeClass: "bg-amber-100 text-amber-700",
    cardClass: "border-amber-200 bg-amber-50/70",
  },
  "ai-limitation": {
    badge: "AI limitation notice",
    badgeClass: "bg-sky-100 text-sky-700",
    cardClass: "border-sky-200 bg-sky-50/70",
  },
  "marketplace-policy": {
    badge: "Marketplace policy notice",
    badgeClass: "bg-violet-100 text-violet-700",
    cardClass: "border-violet-200 bg-violet-50/70",
  },
};

export function DisclaimerNotice({
  variant,
  title,
  body,
  className,
}: {
  variant: DisclaimerVariant;
  title: string;
  body: string;
  className?: string;
}) {
  const style = VARIANT_STYLES[variant];
  return (
    <div className={cx("rounded-xl border p-4 backdrop-blur-sm", style.cardClass, className)}>
      <div
        className={cx(
          "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
          style.badgeClass,
        )}
      >
        {style.badge}
      </div>
      <h3 className="mt-2 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-slate-700">{body}</p>
    </div>
  );
}
