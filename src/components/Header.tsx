import Link from "next/link";

import { isMockMode } from "@/lib/mock-mode";
import { HeaderActions } from "@/components/HeaderActions";

export async function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/10 bg-white/78 backdrop-blur-xl">
      <div className="app-shell flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="group text-sm font-semibold tracking-tight text-slate-900 transition-all duration-300 hover:opacity-90"
        >
          <span className="premium-display bg-gradient-to-r from-slate-950 via-slate-700 to-slate-900 bg-clip-text text-base text-transparent transition-transform duration-300 group-hover:translate-x-[1px] sm:text-lg">
            Listing Studio
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {isMockMode ? (
            <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
              DEV MODE
            </span>
          ) : null}
          <HeaderActions />
        </nav>
      </div>
    </header>
  );
}
