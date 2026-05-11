import "server-only";

import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/mock-mode";
import { MOCK_PRO_COOKIE, MOCK_USAGE_COOKIE, isMockProCookie } from "@/lib/mock-session";

export type UserAccess = {
  is_pro: boolean;
  usage_count: number;
};

export async function getUserOrThrow() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}

export async function getEntitlementForUser(userId: string): Promise<UserAccess> {
  if (isMockMode) {
    const cookieStore = await cookies();
    const isPro = isMockProCookie(cookieStore.get(MOCK_PRO_COOKIE)?.value);
    const usageRaw = cookieStore.get(MOCK_USAGE_COOKIE)?.value ?? "0";
    const usage = Number.parseInt(usageRaw, 10);
    return {
      is_pro: Boolean(isPro),
      usage_count: Number.isFinite(usage) && usage >= 0 ? usage : 0,
    };
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("users")
    .select("is_pro, usage_count")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return {
    is_pro: Boolean(data?.is_pro),
    usage_count: Number(data?.usage_count ?? 0),
  };
}

export async function assertProOrThrow(userId: string) {
  const ent = await getEntitlementForUser(userId);
  if (!ent.is_pro) {
    throw new Error("Pro required");
  }
}

