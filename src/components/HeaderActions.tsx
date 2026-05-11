"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui";
import { useAppUser } from "@/contexts/AppUserContext";

export function HeaderActions() {
  const { profile, signOut } = useAppUser();
  const [actionError, setActionError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  if (!profile) {
    return (
      <>
        <Link
          href="/login"
          className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-xl border border-slate-900/85 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_16px_30px_-20px_rgba(15,23,42,0.62)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Sign up
        </Link>
      </>
    );
  }

  async function handleSignOut() {
    setActionError(null);
    setSigningOut(true);
    try {
      await signOut();
    } catch {
      setActionError("Unable to sign out. Please try again.");
      setSigningOut(false);
    }
  }

  return (
    <>
      <Link
        href="/dashboard"
        className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
      >
        Dashboard
      </Link>
      <Link
        href="/account"
        className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
      >
        Account
      </Link>
      {!profile.is_pro ? (
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-xl border border-slate-900/85 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_16px_30px_-20px_rgba(15,23,42,0.62)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Upgrade
        </Link>
      ) : (
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          Pro Active
        </span>
      )}
      <Button
        type="button"
        variant="ghost"
        loading={signingOut}
        onClick={handleSignOut}
        className="px-3"
      >
        Sign out
      </Button>
      {actionError ? (
        <span className="w-full basis-full text-right text-xs text-red-600 sm:w-auto sm:basis-auto">
          {actionError}
        </span>
      ) : null}
    </>
  );
}
