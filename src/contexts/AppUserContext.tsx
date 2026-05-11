"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppProfile = {
  id: string;
  email: string | null;
  is_pro: boolean;
  usage_count: number;
};

type AppUserContextValue = {
  profile: AppProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AppUserContext = createContext<AppUserContextValue | null>(null);

export function AppUserProvider({
  children,
  initialProfile,
  isMockMode,
}: {
  children: ReactNode;
  initialProfile: AppProfile | null;
  isMockMode: boolean;
}) {
  const [profile, setProfile] = useState<AppProfile | null>(initialProfile);
  const [loading, setLoading] = useState(false);

  const persistMockLocalStorage = useCallback((p: AppProfile | null) => {
    if (typeof window === "undefined" || !isMockMode) return;
    if (!p) {
      localStorage.removeItem("mock_user_state");
      return;
    }
    localStorage.setItem(
      "mock_user_state",
      JSON.stringify({
        id: p.id,
        email: p.email ?? "demo@test.com",
        is_pro: p.is_pro,
        usage_count: p.usage_count,
      }),
    );
  }, [isMockMode]);

  const refreshProfile = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/auth/me", { credentials: "same-origin" });
      const data = (await r.json().catch(() => null)) as
        | {
            authenticated: boolean;
            id?: string;
            email?: string | null;
            is_pro?: boolean;
            usage_count?: number;
          }
        | null;

      if (
        data?.authenticated &&
        typeof data.id === "string" &&
        typeof data.is_pro === "boolean" &&
        typeof data.usage_count === "number"
      ) {
        const next: AppProfile = {
          id: data.id,
          email: data.email ?? null,
          is_pro: data.is_pro,
          usage_count: data.usage_count,
        };
        setProfile(next);
        persistMockLocalStorage(next);
      } else {
        setProfile(null);
        persistMockLocalStorage(null);
      }
    } finally {
      setLoading(false);
    }
  }, [persistMockLocalStorage]);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await fetch("/logout", {
        method: "POST",
        credentials: "same-origin",
        redirect: "manual",
      });
    } finally {
      setProfile(null);
      persistMockLocalStorage(null);
      setLoading(false);
      window.location.replace("/");
    }
  }, [persistMockLocalStorage]);

  const value = useMemo(
    () => ({
      profile,
      loading,
      refreshProfile,
      signOut,
    }),
    [profile, loading, refreshProfile, signOut],
  );

  return <AppUserContext.Provider value={value}>{children}</AppUserContext.Provider>;
}

export function useAppUser() {
  const ctx = useContext(AppUserContext);
  if (!ctx) {
    throw new Error("useAppUser must be used within AppUserProvider");
  }
  return ctx;
}
