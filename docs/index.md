---
layout: default
title: Home
nav_order: 1
---

# Domain: OpenHIM Reusable Mediator

> A configurable mediator that sits between OpenHIM pub channels and adapter channels, applying pipelines of operations (filter, transform, enrich) to CloudEvents before routing them to third-party webhook endpoints.

---

## Aggregates

### Mediation
Connects a source topic to a destination adapter. Owns the pipeline of operations to apply for that specific path. Handles both configuration lifecycle and event processing.

**Lifecycle:** Draft → Active → Deactivated → Deleted

**Constraints:**
- Only one Mediation can be Active for a given topic+destination pair.

**Commands:**
- [`createMediation`](create-mediation.spec) — create a new Mediation in Draft state with source topic, destination, and pipeline steps
- [`updatePipeline`](update-pipeline.spec) — replace the pipeline steps/rules (only in Draft or Deactivated)
- [`activateMediation`](activate-mediation.spec) — Draft → Active (must verify no other Active Mediation exists for same topic+destination)
- [`deactivateMediation`](deactivate-mediation.spec) — Active → Deactivated
- [`deleteMediation`](delete-mediation.spec) — remove permanently (only from Draft or Deactivated)
- `mediate` — run the pipeline against an incoming event; returns processed event + destination, or nothing if filtered out (only when Active)

**Value Objects:**
- **Pipeline** — ordered sequence of steps (filter, transform, enrich), each with its own rules/configuration
- **PipelineStep** — a step type (filter | transform | enrich) paired with its rules

---

## Domain Services

- `mediateEvent(topic, event)` — finds all Active Mediations for the given topic, runs each one's pipeline, collects results (processed event + destination pairs)
- `cloneMediation(sourceMediationId)` — reads an existing Mediation's config and creates a new one in Draft with the same topic, destination, and pipeline
- `switchVersion(oldMediationId, newMediationId)` — deactivates the old Mediation and activates the new one (not atomic — two separate operations)

---

## Policies

- When **Mediation** is activated → verify no other Active Mediation exists for the same topic+destination
- When a filter step drops an event → pipeline short-circuits, no result is returned for that Mediation
- When a pipeline step fails → (open question: fail the whole pipeline? skip the step?)

---

## Open Questions

- **Transformation rule format** — what expression language or mechanism for transform steps? (JSONata, templates, custom mappings?) To be explored during implementation.
- **Enrichment design** — enrichment steps call external APIs. How are those API endpoints and auth configured per step? Low priority but needs a slot in PipelineStep config.
- **Pipeline step failure handling** — if a transform or enrich step fails at runtime, does the whole pipeline fail or do we skip/retry? Needs a policy decision.
- **Uniqueness enforcement for activation** — the "only one active per topic+destination" constraint crosses aggregate boundaries. The domain service enforcing activation will need to query existing Mediations. Worth noting as a design tension.
- **Event shape after transformation** — does the output need to remain a valid CloudEvent, or can transforms produce arbitrary payloads?
