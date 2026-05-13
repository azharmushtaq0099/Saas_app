# Review Overview

This document provides a concise technical briefing for external senior-developer review.

## Project Vision

- Build a premium, Etsy-focused SaaS for AI-assisted listing optimization.
- Combine semantic SEO assistance, conversion-oriented copy support, and educational compliance awareness.
- Keep architecture modular so MVP delivery remains focused while enabling later enterprise expansion.

## CURRENT MVP Scope

- Etsy-first listing generation workflow (text and optional image input).
- Product-focus optimization for cotton and wooden categories.
- Educational compliance and policy-awareness guidance in output UX.
- Server-enforced auth, usage limits, and paid entitlement flow.
- Premium lightweight UI for onboarding, generator, and dashboard experiences.

## Current Implemented Systems

- **AI generation pipeline**
  - Prompt builder, model call, output parser, schema validation, safe-language post-processing.
- **SEO and onboarding engines**
  - Input quality warnings and clarifying intake questions.
- **Compliance awareness engine**
  - Risk badges, educational cards, marketplace notices, and regional reminders.
- **Etsy policy-awareness engine**
  - Pattern-based detection for risky wording/categories with safer alternatives.
- **Marketplace abstraction layer**
  - Strategy map for marketplace voice and policy context (Etsy prioritized).
- **Product focus domain module**
  - Cotton/wooden focus detection and contextual guidance.
- **Core platform systems**
  - Supabase auth/data integration, Stripe payment flow, server-side usage enforcement, UI state context.

## Architecture Decisions (Why It Is Modular)

- **Feature-driven modules**: domain logic isolated under `src/features/*`.
- **Separation of concerns**:
  - `app`: route handlers and page composition
  - `components`: reusable UI
  - `features`: domain engines/services
  - `lib`: infrastructure wrappers and integration adapters
- **Typed contracts**: `zod` schemas enforce request/response boundaries.
- **Server-first trust model**: entitlement and usage checks are not delegated to frontend state.
- **Composable hardening layers**: generation output is parsed, validated, and sanitized before presentation.

## AI Generation Flow (Current)

- Validate request input schema.
- Check minimum context requirements.
- Enforce usage entitlement.
- Build guarded prompt with marketplace and product-focus context.
- Generate model output.
- Parse structured output and validate schema.
- Apply safe-language normalization.
- Build compliance-awareness payload.
- Run policy-awareness detection (input + generated text).
- Return structured response and persist listing in live mode.

## Compliance-Awareness Strategy

- Informational and educational guidance only.
- Uses risk signals to produce:
  - severity badges
  - educational cards
  - marketplace notices
  - regional verification reminders
- Explicitly avoids legal determinations, legal advice, and certification claims.

## Etsy-Focused Marketplace Logic

- Etsy is primary execution target in prompt and UX.
- Marketplace strategy abstraction exists for Amazon/TikTok/eBay contexts.
- Current design supports extension without rewriting core generation pipeline.

## Cotton and Wooden Product Focus

- Domain logic identifies cotton/wooden product signals from listing context.
- Onboarding, SEO guidance, and prompt construction use this signal for relevance.
- Keeps MVP quality higher by constraining category breadth intentionally.

## Future Scalability Direction

- Queue-backed asynchronous generation and retries.
- Prompt/version governance and A/B evaluation.
- Multi-marketplace execution modules with capability matrices.
- Enhanced observability (tracing, quality telemetry, risk analytics).
- Team workflows (roles, approvals, auditability).
- Optional external system integration layer (PIM/DAM/ERP/BI).

## Technical Limitations of Current MVP

- Synchronous request-response generation path only.
- Rule-based policy detection (not probabilistic policy intelligence).
- Limited category depth beyond Etsy-first cotton/wooden focus.
- No advanced workflow orchestration (queues, approvals, case management).
- No enterprise multi-tenant controls, SLA tooling, or deep observability stack yet.

## Intentionally Excluded Enterprise Features

- Autonomous self-learning AI.
- Marketplace scraping infrastructure.
- Live policy crawling and automatic policy ingestion.
- Enterprise PIM/DAM integrations.
- AI model training pipelines.
- Automated competitor intelligence systems.
- Legal compliance certification engine.

## Future Roadmap Possibilities

- Expand category packs and regional policy-awareness packs.
- Add configurable policy rule packs with versioning.
- Introduce async generation jobs and robust retry/fallback mechanisms.
- Add enterprise governance layers (RBAC, audit logs, approval workflows).
- Build operational quality framework (scorecards, regression checks, runbooks).

## Realistic Capability Statement

- The platform is an AI-assisted optimization and educational awareness tool.
- It is not autonomous AI, not self-training, and not a legal compliance system.
- Architecture is intentionally scoped for MVP quality while preserving clear expansion paths.

