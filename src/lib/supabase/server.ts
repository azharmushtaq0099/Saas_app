import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import { isMockMode } from "@/lib/mock-mode";
import { MOCK_SESSION_COOKIE, isMockSessionCookie } from "@/lib/mock-session";
import { getMockUser } from "@/lib/mock-state";

type MockSupabaseServerClient = {
  auth: {
    getUser: () => Promise<{ data: { user: User | null }; error: null }>;
    signInWithPassword: () => Promise<{ data: { user: User }; error: null }>;
    signUp: () => Promise<{ data: { user: User }; error: null }>;
    signOut: () => Promise<{ error: null }>;
  };
};

export async function createSupabaseServerClient() {
  if (isMockMode) {
    const mockClient: MockSupabaseServerClient = {
      auth: {
        async getUser() {
          const cookieStore = await cookies();
          const token = cookieStore.get(MOCK_SESSION_COOKIE)?.value;
          if (!isMockSessionCookie(token)) {
            return { data: { user: null }, error: null };
          }
          const mockUser = getMockUser();
          const user: User = {
            id: mockUser.id,
            email: mockUser.email,
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: "authenticated",
          };
          return { data: { user }, error: null };
        },
        async signInWithPassword() {
          const mockUser = getMockUser();
          const user: User = {
            id: mockUser.id,
            email: mockUser.email,
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: "authenticated",
          };
          return { data: { user }, error: null };
        },
        async signUp() {
          const mockUser = getMockUser();
          const user: User = {
            id: mockUser.id,
            email: mockUser.email,
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: "authenticated",
          };
          return { data: { user }, error: null };
        },
        async signOut() {
          return { error: null };
        },
      },
    };
    return mockClient;
  }

  const cookieStore = await cookies();

  return createServerClient(
    env.client.NEXT_PUBLIC_SUPABASE_URL,
    env.client.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // In Server Components, setting cookies can throw; middleware handles refresh.
          }
        },
      },
    },
  );
}

