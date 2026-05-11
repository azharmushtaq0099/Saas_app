"use client";

import { useEffect } from "react";

import { MOCK_SESSION_COOKIE, MOCK_SESSION_VALUE } from "@/lib/mock-session";

export function MockModeBootstrap() {
  useEffect(() => {
    const hasSession = document.cookie
      .split("; ")
      .some((c) => c.startsWith(`${MOCK_SESSION_COOKIE}=${MOCK_SESSION_VALUE}`));
    if (!hasSession) {
      localStorage.removeItem("mock_user_state");
    }
  }, []);

  return null;
}

