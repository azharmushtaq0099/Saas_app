import "server-only";

import Stripe from "stripe";

import { env } from "@/lib/env";
import { isMockMode } from "@/lib/mock-mode";

export const stripe = isMockMode
  ? (null as unknown as Stripe)
  : new Stripe(env.server.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
    });

