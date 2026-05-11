# AI Workflow and Service Flow

## CURRENT MVP

## 1) API/Service Flow

Primary endpoint: `POST /api/generate`

### Request lifecycle

1. Validate request against `listingInputSchema`
2. Enforce minimum product context requirements
3. Enforce usage entitlement (mock cookie or Supabase RPC)
4. Generate listing output (Gemini + prompt builder)
5. Parse and validate generated structure
6. Apply safe-language rewrite layer
7. Build compliance guidance payload
8. Run Etsy policy-awareness detection on input + output text
9. Persist listing record (live mode)
10. Return typed response to UI

### Response payload (simplified)

- `output`: structured listing object
- `complianceGuidance`: educational risk cards/badges/notices
- `policyWarnings`: risky wording detections + safer suggestions
- `warnings`: lightweight extra checks
- `usage`: generation usage counters

## 2) State Management

### Server state

- Supabase session user
- user entitlement and usage counters
- persisted listing history

### Client state

- `AppUserContext` stores profile + auth actions
- generator page stores:
  - input warnings
  - loading/pending states
  - generation output blocks
  - compliance/policy awareness data
  - upgrade modal state

Design choice: keep state local to feature UI unless cross-route coordination is required.

## 3) Component Architecture

- **Layout shell**: global chrome (`Header`, `Footer`, consent/bootstrap components)
- **Page containers**: route-level orchestration (`dashboard`, `generator`, `pricing`, auth pages)
- **Feature components**: policy awareness panels, disclaimers, plan banners
- **Primitive UI layer**: buttons, inputs, labels, utility helpers

This composition model supports rapid UI evolution while keeping business logic in engines/services.

## 4) AI Engine Behavior

- Strict template generation to control structure
- Optional multimodal image+text input
- Safe-language post-processing to reduce risky phrasing
- Fail-fast behavior when parser/schema validation fails

## 5) Compliance and Policy-Awareness Flow

- Compliance engine: risk signals -> educational cards + recommendations
- Policy-awareness engine: text pattern detection -> severity + safer phrasing
- UX is intentionally non-alarming and trust-oriented

## 6) Scalability Notes

### Current

- Synchronous request/response generation pipeline
- suitable for MVP-level traffic and operational simplicity

### Future

- queue workers for async generation
- retries/fallbacks by model provider
- event telemetry for generation quality and policy risk trends
- enterprise auditability and workflow states

## Explicit System Boundaries

This system is:
- not autonomous AI
- not self-training
- not legal compliance software
- not enterprise PIM/DAM infrastructure

The architecture is intentionally modular so these capabilities can be integrated later without rewriting the core.
