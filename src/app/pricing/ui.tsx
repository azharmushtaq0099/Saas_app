"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import { useAppUser } from "@/contexts/AppUserContext";

export function CheckoutButtons({ isMockMode }: { isMockMode: boolean }) {
  const router = useRouter();
  const { refreshProfile } = useAppUser();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    startTransition(async () => {
      setError(null);
      setMessage("Upgrading...");
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({}),
          credentials: "same-origin",
        });
        const data = (await res.json().catch(() => null)) as
          | { url?: string; error?: string }
          | null;
        if (!res.ok) {
          throw new Error(data?.error ?? "Checkout failed. Please sign in.");
        }
        if (isMockMode) {
          await refreshProfile();
          router.refresh();
          setMessage("Upgrade successful");
          return;
        }
        if (data?.url) {
          window.location.href = data.url;
          return;
        }
        throw new Error("Checkout failed. Please sign in.");
      } catch (err) {
        setMessage(null);
        setError((err as Error).message);
      }
    });
  }

  return (
    <div className="space-y-3">
      <Button type="button" loading={isPending} className="h-11 w-full sm:w-auto" onClick={go}>
        {isPending ? "Redirecting..." : "Unlock Pro - $20 one-time"}
      </Button>
      {message ? <div className="text-sm text-slate-700">{message}</div> : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
    </div>
  );
}
