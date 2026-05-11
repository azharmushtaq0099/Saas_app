import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isMockMode } from "@/lib/mock-mode";

export async function ensureUserRecord(userId: string, emailHint?: string | null) {
  if (isMockMode) return;

  const admin = createSupabaseAdminClient();
  const { data: existing, error: lookupError } = await admin
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  if (lookupError) throw new Error(lookupError.message);
  if (existing) return;

  let email = emailHint ?? null;
  if (!email) {
    const { data: authUserData, error: authError } = await admin.auth.admin.getUserById(userId);
    if (authError) throw new Error(authError.message);
    email = authUserData.user?.email ?? null;
  }
  if (!email) throw new Error("Unable to ensure user record: missing email");

  const { error: upsertError } = await admin.from("users").upsert(
    {
      id: userId,
      email,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (upsertError) throw new Error(upsertError.message);
}
