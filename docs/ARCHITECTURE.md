# Architecture Overview

## CURRENT MVP

Listing Studio is a modular, server-centric Etsy listing optimization SaaS with educational compliance awareness.

### High-level Architecture

- **Presentation layer**: Next.js App Router pages and reusable UI components
- **Application layer**: feature engines (`listing`, `compliance`) and service modules
- **Integration layer**: Supabase (auth/data), Gemini (generation), Stripe (payments)
- **Policy layer**: safe-language enforcement + policy-awareness detection

### Key Design Decisions

- **Server-first trust model**: generation limits and paid entitlements are enforced server-side.
- **Typed contracts**: `zod` schemas define input/output contracts for AI payloads.
- **Engine modularity**: SEO, onboarding, marketplace strategy, compliance, and policy-awareness logic are separated into focused modules.
- **Composable output hardening**: raw model output is parsed, validated, and sanitized before UI rendering.
- **MVP scope control**: Etsy-first UX and product focus to keep quality high and scope realistic.

## FUTURE ENTERPRISE VISION

- Queue-backed asynchronous generation workers
- Versioned model/provider abstraction (multi-LLM fallback routing)
- Team collaboration, RBAC, and approval stages
- Policy packs by region/category with version history and governance
- Multi-tenant enterprise controls, observability, and SLA-aware operations
- Optional connectors into PIM/DAM/ERP stacks

## Engine Architecture

### 1) AI Engine

- `prompt-builder`: constructs structured, guarded prompts from user input and marketplace context
- `ai-generator`: calls Gemini model with optional image + text payload
- `output-parser`: converts strict text template output into typed objects
- `safe-language-engine`: rewrites unsafe/high-risk phrases to educational-safe alternatives

### 2) Compliance Engine

- `compliance-engine`: infer risk signals (child safety, timber/EU, category sensitivity)
- emits:
  - overall risk level
  - badges
  - educational cards
  - region recommendations
  - marketplace notices
- hard constraint: informational/educational guidance only

### 3) SEO Engine

- `seo-engine`: pre-generation quality checks for keyword coverage, audience, title adequacy, and localization context
- integrated with product-focus heuristics to guide Etsy cotton/wooden listing quality

### 4) Marketplace Abstraction

- `marketplace-engine` maps marketplace key to voice + policy-notice strategy
- current runtime priority remains Etsy, while schema supports additional marketplaces without architectural rewrites

## Scalability and Extensibility

### Why this is modular

- Feature logic is isolated under `src/features/*` (domain-driven grouping)
- UI concerns remain in `src/components/*` and page composition in `src/app/*`
- infra wrappers (`src/lib/*`) isolate vendor SDK coupling
- schemas provide stable contracts between UI, API, and engines

### Current scalability posture

- Adequate for MVP throughput and single-request generation flow
- deterministic API boundaries and typed outputs reduce integration fragility

### Planned scalability upgrades

- background jobs for long-running generation
- persisted prompt/version metadata for reproducibility
- rate limiting + request id tracing + distributed logging
- cache policy for repeated generation contexts

## Intentional Limitations (MVP)

- Not autonomous AI orchestration
- Not self-training or online-learning model infrastructure
- Not legal compliance enforcement or legal advisory system
- Not enterprise PIM/DAM data management platform

The architecture intentionally avoids these concerns today while preserving clean extension points for enterprise growth.
