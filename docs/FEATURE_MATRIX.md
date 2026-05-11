# Feature Matrix

This matrix summarizes implemented systems, architectural maturity, and expansion readiness for senior technical review.

## CURRENT MVP

| Feature | Status (Existing / Enhanced / New) | Core Files | Purpose | Current MVP Scope | Future Extension Path |
| --- | --- | --- | --- | --- | --- |
| AI listing generation engine | Enhanced | `src/features/listing/services/ai-generator.ts`, `src/features/listing/services/output-parser.ts`, `src/features/listing/schemas.ts` | Generate structured listing content from text/image input with typed parsing | Synchronous Etsy-first generation with strict schema validation | Async job queue, multi-model fallback, output versioning |
| SEO engine | Enhanced | `src/features/listing/engines/seo-engine.ts` | Pre-generation SEO quality checks (keywords, title quality, audience/market completeness) | Lightweight heuristic warnings for listing quality | Search-intent scoring, SERP intent clusters, keyword opportunity model |
| Compliance awareness engine | Existing | `src/features/compliance/compliance-engine.ts`, `src/lib/compliance-guidance.ts` | Educational risk awareness cards, badges, and regional reminders | Informational compliance-awareness only (not legal enforcement) | Region/category policy packs, compliance evidence workflows |
| Etsy policy-awareness engine | New | `src/features/compliance/etsy-policy-awareness-engine.ts`, `src/app/api/generate/route.ts` | Detect risky wording/categories and return educational warnings + safer alternatives | Pattern-based detection for high-risk terms/categories | Rule versioning, confidence scoring, external policy source adapters |
| Safe language engine | New | `src/features/compliance/safe-language-engine.ts`, `src/features/listing/services/ai-generator.ts` | Normalize unsafe/guarantee phrasing into safe educational language | Deterministic replacement strategy | NLP classifier + context-sensitive rewriting pipeline |
| Onboarding engine | Enhanced | `src/features/listing/engines/onboarding-engine.ts` | Ask clarifying intake questions to improve generation quality | Guided seller intake before generation | Dynamic adaptive onboarding graph by seller segment |
| Product focus engine | New | `src/features/listing/domain/product-focus.ts` | Infer cotton/wooden focus and inject context into flows | Etsy-focused product domains (cotton + wooden) | Category ontology service and expandable taxonomy registry |
| Prompt builder system | Enhanced | `src/features/listing/services/prompt-builder.ts`, `src/features/listing/engines/marketplace-engine.ts` | Build guarded, structured prompts with marketplace and safety constraints | Etsy-priority prompt template with strict output contract | Prompt registry, A/B prompt experiments, policy-conditioned prompt packs |
| Marketplace abstraction layer | Existing | `src/features/listing/engines/marketplace-engine.ts`, `src/features/listing/schemas.ts` | Separate marketplace voice/policy context from core generation logic | Etsy primary runtime, additional marketplaces modeled | Pluggable marketplace modules + marketplace capability matrix |
| Dashboard UI system | Enhanced | `src/app/dashboard/page.tsx`, `src/app/globals.css`, `src/components/ui.tsx` | Workspace metrics, onboarding progression, usage visibility | Single-user dashboard for MVP operations | Multi-workspace analytics, role-based dashboards, cohort insights |
| Policy awareness UI | New | `src/components/policy/PolicyAwarenessPanel.tsx`, `src/app/app/ui.tsx` | Present policy risk warnings with severity and safer phrasing UX | Calm educational warning cards in generator output | Explainability panel, policy action checklist, review history |
| State management | Existing | `src/contexts/AppUserContext.tsx`, `src/app/app/ui.tsx` | Manage profile/session state and generator UI interaction state | Context + local component state pattern | Server-state cache layer, event-driven state orchestration |
| Auth system | Existing | `src/app/api/auth/login/route.ts`, `src/app/api/auth/signup/route.ts`, `src/app/api/auth/me/route.ts`, `src/contexts/AppUserContext.tsx` | Email/password auth, profile hydration, sign-out lifecycle | Supabase-backed auth for single-tenant MVP | SSO, RBAC, org memberships, audit-auth events |
| Stripe/payment flow | Existing | `src/app/api/stripe/checkout/route.ts`, `src/app/api/stripe/webhook/route.ts`, `src/app/pricing/ui.tsx` | Paid upgrade workflow and entitlement activation | One-time Pro unlock with webhook verification | Subscription tiers, invoicing, seat-based billing |
| Supabase integration | Existing | `src/lib/supabase/server.ts`, `src/lib/supabase/admin.ts`, `src/lib/entitlements.ts`, `supabase/schema.sql` | Data/auth backend integration and entitlement enforcement | Auth + usage + listing persistence for MVP | Read replicas, data retention policies, tenant isolation patterns |
| Architecture docs | New | `README.md`, `docs/ARCHITECTURE.md`, `docs/FOLDER_STRUCTURE.md` | Senior review documentation of structure, boundaries, and scalability | Technical transparency for MVP architecture | ADR repository, decision logs, system diagrams |
| AI workflow docs | New | `docs/AI_WORKFLOW.md`, `docs/PROMPT_STRATEGY.md` | Document runtime flow, prompting, guardrails, and state boundaries | Clear AI execution and safety explanation for review | SRE runbooks, failure mode matrices, operational playbooks |

## FUTURE ENTERPRISE ROADMAP

- Multi-marketplace execution as first-class pluggable modules (beyond strategy hints)
- Queue-backed asynchronous generation and retry orchestration
- Prompt/version registry with controlled rollout and A/B governance
- Enterprise observability: tracing, quality telemetry, and policy-risk analytics
- Team collaboration model: RBAC, approval workflows, and audit logs
- Integration framework for optional external systems (PIM/DAM/ERP/BI)

## Architecture Maturity and Intentional MVP Boundaries

- The current system is modular by design (`features`, `services`, `engines`, `components`, `lib`) to support extension without full rewrites.
- AI behavior is constrained, deterministic at boundaries (schema + parsing + safety layers), and human-review oriented.
- Compliance and policy features are educational awareness mechanisms, not legal decision engines.
- Marketplace support is abstraction-ready, with Etsy-first execution deliberately prioritized for focus and quality.

## Intentionally Deferred Enterprise Features

- Autonomous self-learning AI
- Marketplace scraping infrastructure
- Live policy crawling
- Enterprise PIM/DAM integrations
- AI model training pipelines
- Automated competitor intelligence systems
- Legal compliance certification engine

