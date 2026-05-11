# Prompt Strategy and Guardrails

## CURRENT MVP

Prompting is deterministic, schema-oriented, and safety-constrained.

## Prompt Design Goals

- Produce high-quality Etsy listing content with semantic SEO
- Improve human readability and buyer psychology alignment
- Surface educational compliance awareness reminders
- Avoid legal-risk, medical-risk, and guarantee-style language

## Prompt Construction Pipeline

1. Collect typed listing input (`listingInputSchema`)
2. Infer product focus context (cotton/wooden/general)
3. Inject marketplace strategy (voice + notices)
4. Apply hard behavioral constraints
5. Force strict output template for parser compatibility

## Guardrail Strategy

### Content constraints

- No legal guarantees
- No certification/approval claims
- No guaranteed sales claims
- No unsupported medical outcomes
- No brand/IP misuse references

### Wording constraints

Preferred examples:
- "Consider verifying..."
- "Please ensure..."
- "You may need..."
- "Recommended for..."
- "Educational compliance awareness"

Disallowed examples:
- "Guaranteed compliant"
- "Legally approved"
- "Certified safe"
- "Risk-free"
- "Guaranteed sales"

## Post-Generation Hardening

- Parse generated text into structured sections
- Validate shape with `listingOutputSchema`
- Run safe-language normalization engine
- Run policy-awareness detection for risky wording

This layered approach reduces model drift risks while preserving useful output quality.

## Explicit Non-Goals

- Not autonomous policy moderation
- Not legal compliance enforcement
- Not self-training model adaptation

## FUTURE ENTERPRISE VISION

- Prompt version registry with A/B tracking
- Model-provider abstraction and routing policies
- Region/category prompt packs
- Retrieval-augmented policy context
- Controlled prompt governance workflows
