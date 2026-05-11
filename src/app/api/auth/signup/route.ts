import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/mock-mode";
import { MOCK_SESSION_COOKIE, MOCK_SESSION_VALUE } from "@/lib/mock-session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: signUpData, error } = await supabase.auth.signUp({
    email: body.data.email,
    password: body.data.password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true, userId: signUpData.user?.id ?? null });
  if (isMockMode && signUpData.user) {
    response.cookies.set(MOCK_SESSION_COOKIE, MOCK_SESSION_VALUE, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      httpOnly: true,
    });
  }
  return response;
}

