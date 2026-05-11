const isMock =
  process.env.MOCK_MODE === "true" ||
  process.env.NODE_ENV !== "production";

function getEnv(name: string, fallback = "") {
  const value = process.env[name];

  if (isMock) {
    return value || fallback;
  }

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  client: {
    NEXT_PUBLIC_APP_URL: getEnv(
      "NEXT_PUBLIC_APP_URL",
      "http://localhost:3000"
    ),

    NEXT_PUBLIC_SUPABASE_URL: getEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      "https://mock.supabase.co"
    ),

    NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnv(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "mock-anon-key"
    ),
  },

  server: {
    NEXT_PUBLIC_APP_URL: getEnv(
      "NEXT_PUBLIC_APP_URL",
      "http://localhost:3000"
    ),

    NEXT_PUBLIC_SUPABASE_URL: getEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      "https://mock.supabase.co"
    ),

    NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnv(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "mock-anon-key"
    ),

    SUPABASE_SERVICE_ROLE_KEY: getEnv(
      "SUPABASE_SERVICE_ROLE_KEY",
      "mock-service-role"
    ),

    STRIPE_SECRET_KEY: getEnv(
      "STRIPE_SECRET_KEY",
      "mock-stripe-secret"
    ),

    STRIPE_WEBHOOK_SECRET: getEnv(
      "STRIPE_WEBHOOK_SECRET",
      "mock-webhook-secret"
    ),

    STRIPE_PRICE_ID: getEnv(
      "STRIPE_PRICE_ID",
      "mock-price-id"
    ),

    GEMINI_API_KEY: getEnv(
      "GEMINI_API_KEY",
      "mock-gemini-key"
    ),
  },
};