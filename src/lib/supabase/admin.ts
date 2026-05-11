import "server-only";

import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import { isMockMode } from "@/lib/mock-mode";
import { getMockEntitlement } from "@/lib/mock-state";

type MockSupabaseAdminClient = {
  auth: {
    admin: {
      getUserById: () => Promise<{ data: { user: { email: string } }; error: null }>;
    };
  };
  from: () => {
    select: () => {
      eq: () => {
        maybeSingle: () => Promise<{ data: ReturnType<typeof getMockEntitlement>; error: null }>;
      };
    };
    insert: () => Promise<{ error: null }>;
    upsert: () => Promise<{ error: null }>;
  };
};

export function createSupabaseAdminClient() {
  if (isMockMode) {
    const mockClient: MockSupabaseAdminClient = {
      auth: {
        admin: {
          async getUserById() {
            return { data: { user: { email: "demo@test.com" } }, error: null };
          },
        },
      },
      from() {
        return {
          select() {
            return {
              eq() {
                return {
                  async maybeSingle() {
                    return { data: getMockEntitlement(), error: null };
                  },
                };
              },
            };
          },
          async insert() {
            return { error: null };
          },
          async upsert() {
            return { error: null };
          },
        };
      },
    };
    return mockClient;
  }

  return createClient(
    env.client.NEXT_PUBLIC_SUPABASE_URL,
    env.server.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

