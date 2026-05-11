"use client";

import { useState } from "react";

import { Button } from "@/components/ui";

const CONSENT_KEY = "listing_studio_cookie_notice_v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(CONSENT_KEY);
  });

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:max-w-md">
      <div className="premium-panel rounded-2xl p-4">
        <p className="text-sm leading-relaxed text-slate-700">
          We use essential cookies and lightweight analytics to improve product quality and security.
          You can continue by acknowledging this privacy notice.
        </p>
        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            className="h-9 px-4 text-xs"
            onClick={() => {
              localStorage.setItem(CONSENT_KEY, "accepted");
              setVisible(false);
            }}
          >
            Acknowledge
          </Button>
        </div>
      </div>
    </div>
  );
}
