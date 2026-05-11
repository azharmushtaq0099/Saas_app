import Link from "next/link";

const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/ai-disclaimer", label: "AI Disclaimer" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-900/10 bg-transparent py-12 text-sm text-muted-foreground">
      <div className="app-shell">
        <div className="premium-panel flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Listing Studio</div>
            <div className="mt-1 text-xs text-slate-500">
              AI marketplace optimization platform with human-in-the-loop review.
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-1 py-0.5 text-slate-600 transition-colors duration-200 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="mailto:hello@listingstudio.ai"
              className="rounded-md px-1 py-0.5 text-slate-600 transition-colors duration-200 hover:text-slate-900"
            >
              Contact
            </a>
          </nav>
        </div>
        <div className="mt-5 text-center text-xs text-slate-500 sm:text-left">
          © {new Date().getFullYear()} Listing Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
