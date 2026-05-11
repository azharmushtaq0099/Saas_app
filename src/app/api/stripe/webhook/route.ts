import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isMockMode } from "@/lib/mock-mode";
import { ensureUserRecord } from "@/lib/user-record";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const EXPECTED_CURRENCY = "usd";
const EXPECTED_AMOUNT_TOTAL = 2000;

async function markUserPro(userId: string, stripeCustomerId: string | null, stripeSessionId: string) {
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("users").upsert(
    {
      id: userId,
      is_pro: true,
      stripe_customer_id: stripeCustomerId,
      stripe_session_id: stripeSessionId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(error.message);
}

async function shouldProcessEvent(stripeEventId: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("webhook_events")
    .select("stripe_event_id")
    .eq("stripe_event_id", stripeEventId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (data) return false;

  const { error: insertError } = await admin.from("webhook_events").insert({
    stripe_event_id: stripeEventId,
  });
  if (insertError) {
    if (insertError.code === "23505") return false;
    throw new Error(insertError.message);
  }
  return true;
}

export async function POST(request: Request) {
  if (isMockMode) {
    return NextResponse.json({ received: true });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, env.server.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", { error });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true });
    }
    const processEvent = await shouldProcessEvent(event.id);
    if (!processEvent) {
      return NextResponse.json({ received: true });
    }

    const completedSession = event.data.object as Stripe.Checkout.Session;
    const sessionId = completedSession.id;
    if (!sessionId) {
      console.error("Stripe webhook validation failed: missing checkout session id");
      return NextResponse.json({ received: true });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price"],
    });

    if (session.payment_status !== "paid") {
      console.error("Stripe webhook validation failed: payment status is not paid", {
        sessionId,
        paymentStatus: session.payment_status,
      });
      return NextResponse.json({ received: true });
    }

    const expectedPriceId = env.server.STRIPE_PRICE_ID;

    const paidItem = session.line_items?.data?.find((item) => item.quantity && item.quantity > 0);
    const itemPrice = paidItem?.price;
    const itemPriceId = typeof itemPrice === "string" ? itemPrice : itemPrice?.id;
    const currency = session.currency;
    const amountTotal = session.amount_total;
    if (
      itemPriceId !== expectedPriceId ||
      currency !== EXPECTED_CURRENCY ||
      amountTotal !== EXPECTED_AMOUNT_TOTAL
    ) {
      console.error("Stripe webhook strict validation failed", {
        sessionId,
        expectedPriceId,
        receivedPriceId: itemPriceId,
        expectedCurrency: EXPECTED_CURRENCY,
        receivedCurrency: currency,
        expectedAmountTotal: EXPECTED_AMOUNT_TOTAL,
        receivedAmountTotal: amountTotal,
      });
      return NextResponse.json({ received: true });
    }

    const userId = session.metadata?.user_id;
    if (!userId) {
      console.error("Stripe webhook validation failed: missing metadata.user_id", { sessionId });
      return NextResponse.json({ received: true });
    }

    await ensureUserRecord(userId);
    const stripeCustomerId = typeof session.customer === "string" ? session.customer : null;
    await markUserPro(userId, stripeCustomerId, session.id);
  } catch (e) {
    console.error("Stripe webhook processing error", { error: e });
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

