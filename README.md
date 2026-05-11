# Listing Studio (Etsy AI Listing Optimization MVP)

Premium, Etsy-focused SaaS MVP for AI-assisted listing optimization, educational compliance awareness, and semantic SEO guidance.

## CURRENT MVP

- Primary user: Etsy sellers
- Primary product focus: cotton and wooden product categories
- AI-assisted listing generation (title, bullets, description, tags, SEO blocks)
- Educational policy/compliance awareness (not legal enforcement)
- Policy-risk wording detection with safer phrasing suggestions
- Server-side usage/paywall enforcement (free vs pro)
- Stripe one-time upgrade flow and webhook-verified entitlement updates

## FUTURE ENTERPRISE VISION

- Multi-marketplace orchestration (Amazon, TikTok Shop, eBay, Walmart, Bol, Allegro)
- Expanded compliance knowledge packs by region and category
- Team workspaces, audit logs, and approval workflows
- Asynchronous generation pipelines and queue workers
- Observability, analytics, and policy quality scoring
- Enterprise-grade integrations (PIM/DAM, ERP, BI) as optional modules

## Explicit Non-Goals

This platform is:
- not autonomous AI
- not a self-training model
- not legal compliance software
- not legal advice
- not marketplace approval software
- not enterprise PIM/DAM infrastructure (in current MVP)

## Technical Stack

- Next.js App Router + TypeScript + TailwindCSS
- Supabase (Auth + Postgres + server-side RPC usage enforcement)
- Gemini (`@google/generative-ai`) for listing generation
- Stripe Checkout + webhook for paid entitlement activation

## Documentation Index

- `docs/ARCHITECTURE.md` — technical architecture, modularity decisions, scalability strategy
- `docs/FOLDER_STRUCTURE.md` — codebase structure and responsibilities
- `docs/PROMPT_STRATEGY.md` — prompt strategy, guardrails, and safe-language policy
- `docs/AI_WORKFLOW.md` — API/service flow, state management, and runtime behavior

## Setup

### 1) Environment Variables

Copy `.env.example` to `.env.local` and fill:

```bash
cp .env.example .env.local
```

Required keys:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID`
- `GEMINI_API_KEY`

### 2) Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql`.
3. Enable email auth and set redirect URLs.

Core tables/functions:
- `public.users(id, email, is_pro, usage_count, ...)`
- `public.consume_generation(limit_free)` (server-side generation entitlement gate)

### 3) Stripe Setup

1. Create a one-time `$20` product/price.
2. Set `STRIPE_PRICE_ID`.
3. Add webhook endpoint: `https://<domain>/api/stripe/webhook`
4. Subscribe to `checkout.session.completed`.
5. Set `STRIPE_WEBHOOK_SECRET`.

### 4) Local Development

```bash
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### 5) Quality Check

```bash
npm run lint
npm run build
```

## Security and Correctness Notes

- Entitlement/paywall logic is enforced server-side and in Supabase RPC.
- Stripe webhook is the source of truth for `is_pro` status.
- Service role key remains server-only.
- AI output is post-processed through safe-language and policy-awareness engines.
- Compliance output is educational awareness, never legal certification.
