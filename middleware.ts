import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { env } from "@/lib/env";
import { isMockMode } from "@/lib/mock-mode";
import { MOCK_SESSION_COOKIE, isMockSessionCookie } from "@/lib/mock-session";

const PROTECTED_PREFIXES = ["/dashboard", "/generator", "/ebook", "/account"];

export async function middleware(request: NextRequest) {
  if (isMockMode) {
    const pathname = request.nextUrl.pathname;
    const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
    const hasSession = isMockSessionCookie(request.cookies.get(MOCK_SESSION_COOKIE)?.value);

    if (!hasSession && isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    if (hasSession && (pathname === "/login" || pathname === "/signup")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next({ request });
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    env.client.NEXT_PUBLIC_SUPABASE_URL,
    env.client.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refresh session if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next (static files)
     * - public files
     * - stripe webhook (must be unauthenticated)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/stripe/webhook).*)",
  ],
};

