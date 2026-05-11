"use client";

import { useState, useTransition } from "react";

import { Button, Input, Label } from "@/components/ui";

export function LoginForm({ nextPath, signedOut }: { nextPath: string; signedOut?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="app-shell flex flex-1 flex-col justify-center py-16 sm:py-20">
      <div className="mx-auto w-full max-w-md premium-panel premium-surface-animated relative overflow-hidden p-8 sm:p-10">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-sky-100/90 blur-3xl" />
        <h1 className="premium-display text-3xl font-semibold tracking-tight text-slate-900">Sign in</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Access the generator, usage history, and your eBook.
        </p>
        <div className="mt-6 premium-card px-4 py-3 text-xs text-slate-600">
          Calm onboarding: sign in, review guidance, and generate marketplace-ready copy.
        </div>
        {signedOut ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700">
            Signed out
          </div>
        ) : null}

        <form
          className="mt-8 space-y-4"
          action={(formData) => {
            startTransition(async () => {
              setError(null);
              const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  email: String(formData.get("email") ?? ""),
                  password: String(formData.get("password") ?? ""),
                }),
              });
              if (res.ok) {
                window.location.href = nextPath;
                return;
              }
              const data = (await res.json().catch(() => null)) as
                | { error?: string }
                | null;
              setError(data?.error ?? "Unable to sign in.");
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {error ? (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <Button type="submit" className="h-11 w-full" loading={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-sm text-muted-foreground">
            New here?{" "}
            <a
              className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-slate-800"
              href="/signup"
            >
              Create an account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
