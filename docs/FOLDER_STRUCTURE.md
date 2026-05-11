# Folder Structure (Senior Review)

## CURRENT MVP

```text
src/
  app/                      # Next.js routes, pages, API handlers
    api/                    # Server endpoints (auth, generate, stripe, ebook)
    dashboard/              # Dashboard route
    generator/              # Generator shell route
    app/                    # Generator client UI composition
  components/               # Reusable UI building blocks
    policy/                 # Policy-awareness UI panels
    disclaimers/            # Reusable educational notices
    legal/                  # Legal-content page template
  contexts/                 # React context/state boundary
  features/                 # Domain modules and engines
    listing/                # Listing schemas, prompt and generation engines
      domain/               # Product-focus domain logic
      engines/              # SEO/onboarding/marketplace strategy engines
      services/             # Prompt, parser, AI generation, formatter
    compliance/             # Compliance and policy-awareness engines
  lib/                      # Integration wrappers and shared server utilities
    supabase/               # Supabase clients
supabase/
  schema.sql                # Database schema and DB-level policies/functions
docs/
  ARCHITECTURE.md
  FOLDER_STRUCTURE.md
  PROMPT_STRATEGY.md
  AI_WORKFLOW.md
```

## Why this structure is maintainable

- **Clear boundaries**: route composition, UI components, domain engines, and infra utilities are separated.
- **Feature grouping**: listing/compliance capabilities are colocated by domain, not by technical layer only.
- **Extensible modules**: new engines can be added under `features/*/engines` without disrupting existing routes.
- **Low coupling**: integration logic in `lib` prevents SDK leakage through the codebase.

## FUTURE ENTERPRISE VISION

Proposed growth pattern:

- `src/features/marketplaces/*` for per-marketplace rule packs
- `src/features/policies/*` for versioned policy models
- `src/workers/*` for async generation and policy processing
- `src/observability/*` for metrics/tracing/log correlation
- `src/integrations/*` for ERP/PIM/DAM connectors
- `src/modules/team-workspaces/*` for enterprise collaboration

This preserves existing boundaries while supporting scale and team parallelism.
