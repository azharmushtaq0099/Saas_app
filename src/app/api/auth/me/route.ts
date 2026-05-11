import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getEntitlementForUser } from "@/lib/entitlements";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ authenticated: false as const });
  }

  const ent = await getEntitlementForUser(user.id);

  return NextResponse.json({
    authenticated: true as const,
    id: user.id,
    email: user.email ?? null,
    is_pro: ent.is_pro,
    usage_count: ent.usage_count,
  });
}
