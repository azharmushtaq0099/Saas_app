import Link from "next/link";
import { forwardRef } from "react";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("h-4 w-4 shrink-0", className)}
      aria-hidden
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
    loading?: boolean;
  }
>(function Button({ className, variant = "primary", loading = false, children, ...props }, ref) {
  return (
    <button
      ref={ref}
      disabled={props.disabled || loading}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99] disabled:pointer-events-none disabled:opacity-45",
        variant === "primary" &&
          "border border-slate-900/85 bg-slate-900 text-slate-50 shadow-[0_16px_30px_-20px_rgba(15,23,42,0.62)] hover:-translate-y-0.5 hover:bg-slate-800",
        variant === "secondary" &&
          "border border-border bg-white/88 text-foreground shadow-[0_12px_26px_-20px_rgba(15,23,42,0.34)] backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white",
        variant === "ghost" &&
          "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : null}
      {children}
    </button>
  );
});

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]",
        variant === "primary" &&
          "border border-slate-900/85 bg-slate-900 text-slate-50 shadow-[0_16px_30px_-20px_rgba(15,23,42,0.62)] hover:-translate-y-0.5 hover:bg-slate-800",
        variant === "secondary" &&
          "border border-border bg-white/88 text-foreground shadow-[0_12px_26px_-20px_rgba(15,23,42,0.34)] backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white",
        variant === "ghost" &&
          "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "h-11 w-full rounded-xl border border-input bg-white/90 px-3.5 text-sm text-foreground shadow-[0_10px_22px_-18px_rgba(15,23,42,0.38)] outline-none backdrop-blur-sm transition-[color,box-shadow,border-color,transform] duration-200 file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-secondary-foreground placeholder:text-muted-foreground focus-visible:-translate-y-[0.5px] focus-visible:border-slate-300 focus-visible:ring-2 focus-visible:ring-ring/60",
        props.className,
      )}
    />
  );
}

export function Label({
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={cx("text-sm font-medium text-foreground/85", props.className)}
    >
      {children}
    </label>
  );
}
