---
title: Mediate
parent: Mediation
nav_order: 4
---

# Mediate

> Runs a CloudEvent through a mediation's pipeline — executing filter, transform, and enrich steps in order. Produces a routing outcome: the event is either processed and forwarded to the destination, or skipped if filters reject it.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **event-processed** | The event passes all filters and transforms complete | The transformed event and destination are returned for dispatch |
| **event-skipped** | A filter step rejects the event | The mediation's destination is returned with a skip indicator |

> No side effects — this is a pure function. The caller decides what to do with the result.

---

## Interface

| | |
|---|---|
| **Name** | `mediate` |
| **Input** | `event` (CloudEvent), `mediation` (ActiveMediation), `transformRegistry` |
| **Output** | `MediateResult` — event + destination, or skip indicator |
| **Sync/Async** | Sync (core function) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Event matches filter and is transformed** | A filter checking `data.type equals patient` passes, then an `uppercase` transform runs | Processed event returned with the mediation's destination |
| **Event passes filter, no transforms** | Pipeline has only a filter step, event matches | Original event returned unchanged with the destination |
| **Empty pipeline** | No steps in the pipeline | Event passes through unchanged |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `unknown_transform` | A transform name in the pipeline is not found in the transform registry | `executeTransforms` step |

### Assertions

When an event is processed:
- Destination comes from the mediation configuration
- The event is returned (possibly transformed)

When an event is skipped:
- Destination comes from the mediation configuration
- No event data is returned

---

## Pipeline & Decision Table

For the full pipeline table and decision table, see the auto-generated
[mediate.spec.md](../../src/mediation/mediate/core/mediate.spec.md).

> **STEP** — domain function. Fully testable in isolation with `testSpec`.
> **SAFE-DEP** — infrastructure dependency with runtime validation of returned data.
> **DEP** — infrastructure capability. Injected by the app layer.
