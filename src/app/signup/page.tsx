"use client";

import { useState, useTransition } from "react";

import { Button, Input, Label } from "@/components/ui";

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="app-shell flex flex-1 flex-col justify-center py-16 sm:py-20">
      <div className="mx-auto w-full max-w-md premium-panel premium-surface-animated relative overflow-hidden p-8 sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sky-100/90 blur-3xl" />
        <h1 className="premium-display text-3xl font-semibold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Start generating listings and unlock the eBook with Pro.
        </p>
        <div className="mt-6 premium-card px-4 py-3 text-xs text-slate-600">
          Elegant onboarding flow with guided inputs, educational compliance awareness, and semantic SEO output.
        </div>

        <form
          className="mt-8 space-y-4"
          action={(formData) => {
            startTransition(async () => {
              setError(null);
              const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  email: String(formData.get("email") ?? ""),
                  password: String(formData.get("password") ?? ""),
                }),
              });
              if (res.ok) {
                window.location.href = "/dashboard";
                return;
              }
              const data = (await res.json().catch(() => null)) as
                | { error?: string }
                | null;
              setError(data?.error ?? "Unable to create account.");
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
              minLength={8}
              autoComplete="new-password"
            />
            <p className="text-xs text-slate-500">Minimum 8 characters.</p>
          </div>
          {error ? (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <Button type="submit" className="h-11 w-full" loading={isPending}>
            {isPending ? "Creating..." : "Create account"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-slate-800"
              href="/login"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
