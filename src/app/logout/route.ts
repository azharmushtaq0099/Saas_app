import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/mock-mode";
import { MOCK_PRO_COOKIE, MOCK_SESSION_COOKIE, MOCK_USAGE_COOKIE } from "@/lib/mock-session";
import { resetMockUserState } from "@/lib/mock-state";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  if (isMockMode) {
    resetMockUserState();
  }
  const response = NextResponse.redirect(new URL("/", env.client.NEXT_PUBLIC_APP_URL), {
    status: 303,
  });
  response.cookies.delete(MOCK_SESSION_COOKIE);
  response.cookies.delete(MOCK_PRO_COOKIE);
  response.cookies.delete(MOCK_USAGE_COOKIE);
  return response;
}

export async function GET() {
  // Convenience: allow GET to sign out via link.
  return POST();
}

