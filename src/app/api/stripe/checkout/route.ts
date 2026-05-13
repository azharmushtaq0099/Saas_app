import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { getUserOrThrow } from "@/lib/entitlements";
import { isMockMode } from "@/lib/mock-mode";
import { simulateMockUpgrade } from "@/lib/mock-state";
import { MOCK_PRO_COOKIE, MOCK_PRO_VALUE } from "@/lib/mock-session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  await request.json().catch(() => ({}));
  if (isMockMode) {
    await simulateMockUpgrade(1000);
    const res = NextResponse.json({
      url: new URL("/account?checkout=success", env.client.NEXT_PUBLIC_APP_URL).toString(),
    });
    res.cookies.set(MOCK_PRO_COOKIE, MOCK_PRO_VALUE, { path: "/" });
    return res;
  }

  let user;
  try {
    user = await getUserOrThrow();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const successUrl = new URL("/account?checkout=success", env.client.NEXT_PUBLIC_APP_URL);
  const cancelUrl = new URL("/pricing?checkout=cancel", env.client.NEXT_PUBLIC_APP_URL);

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email ?? undefined,
      line_items: [{ price: env.server.STRIPE_PRICE_ID, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      metadata: {
        user_id: user.id,
        unlock: "pro_lifetime",
      },
    });
  } catch (e) {
    console.error("/api/stripe/checkout session create failed", e);
    return NextResponse.json({ error: "Checkout unavailable. Try again shortly." }, { status: 503 });
  }

  if (!session.url) {
    return NextResponse.json({ error: "Checkout session missing redirect URL." }, { status: 502 });
  }

  return NextResponse.json({ url: session.url });
}

