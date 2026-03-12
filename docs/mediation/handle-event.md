---
title: Handle Event
parent: Mediation
nav_order: 5
---

# Handle Event

> Receives an incoming CloudEvent, validates it against its declared schema, fans out to every active mediation registered for that event type, dispatches processed results to their destinations, and returns a summary of what was dispatched and what was skipped.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **events-dispatched** | At least one mediation processed the event and dispatch succeeded | Processed events sent to their destinations. Summary includes dispatch entries and skipped mediation IDs. |
| **all-skipped** | Mediations exist for this event type but all filters rejected it | No dispatches sent. Pipeline short-circuits before dispatch. |
| **no-mediations** | No active mediations are registered for this event type | No dispatches, no skips. Pipeline short-circuits before dispatch. |

> The operation is protected by schema validation before any mediation runs, and by outcome evaluation before any dispatch is attempted. Events that don't match any mediation never reach the dispatch step.

---

## Interface

| | |
|---|---|
| **Name** | `handleEvent` |
| **Input** | CloudEvent (must include `type` and `dataschema` attributes) |
| **Output** | Topic, list of dispatch entries (event + destination + mediation ID), list of skipped mediation IDs |
| **Sync/Async** | Async (shell factory with curried dependency injection) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **One mediation matches, one skips** | A Patient resource event arrives. Two mediations are registered: one routes matching patients to an SHR, the other only accepts inactive patients for audit logging. The patient is active. | The SHR mediation processes and transforms the event. The event is dispatched to `shr.example.com`. The audit mediation is skipped. |
| **All mediations skip** | A Patient resource event arrives but no mediation's filter criteria match the event data. | No events are dispatched. All mediation IDs appear in the skipped list. Pipeline ends at outcome evaluation. |
| **No mediations registered** | An event type arrives that has no active mediations configured. | Empty dispatches and empty skipped list. Pipeline ends at outcome evaluation. |

### Failure Cases

No processing occurs in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `missing_dataschema` | The CloudEvent does not carry a `dataschema` attribute | `extractEventType` step |
| `schema_not_found` | The `dataschema` URI does not resolve to a known schema in the registry | `resolveSchema` dep |
| `schema_validation_failed` | The event's data payload does not conform to the resolved JSON Schema | `validateEventData` step |
| `unknown_transform` | A mediation's pipeline references a transform function not found in the registry | `mediateAll` step |
| `dispatch_failed` | Sending a processed event to its destination failed | `dispatchAll` dep |

### Assertions

When events are dispatched:
- There is at least one dispatch entry
- The output topic matches the input event's type

When all mediations skip:
- The dispatches list is empty
- At least one mediation ID appears in the skipped list

When no mediations are found:
- Both dispatches and skipped lists are empty

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `extractEventType` | `STEP` | Read `event.type` as the routing topic and validate `dataschema` presence | `missing_dataschema` |
| 2 | `resolveSchema` | `DEP` | Fetch the JSON Schema from the schema registry using the `dataschema` URI | -- |
| 3 | `validateEventData` | `STEP` | Validate `event.data` against the resolved JSON Schema | `schema_validation_failed` |
| 4 | `findActiveMediationsByTopic` | `DEP` | Query all active mediations whose topic matches the event type | -- |
| 5 | `getTransformRegistry` | `DEP` | Retrieve the available transform function registry | -- |
| 6 | `mediateAll` | `STEP` | Run the mediate pipeline for each mediation, collect dispatch/skip results | `unknown_transform` |
| 7 | `evaluateMediateOutcome` | `STEP` | If no dispatches, short-circuit to `all-skipped` or `no-mediations`. Otherwise continue. | -- |
| 8 | `dispatchAll` | `DEP` | Send each processed event to its destination endpoint | -- |
| 9 | `evaluateSuccessType` | `STEP` | Assemble final result after successful dispatch | -- |

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (schema registry, database, HTTP dispatch).

---

## Decision Table

| Scenario | `extract` :no_schema | `validate` :schema_fail | `mediateAll` :unk_xform | `(own)` :schema_404 | `(own)` :dispatch_fail | Outcome |
|---|:---:|:---:|:---:|:---:|:---:|---|
| OK events-dispatched | pass | pass | pass | pass | pass | events-dispatched |
| OK all-skipped | pass | pass | pass | pass | -- | all-skipped |
| OK no-mediations | pass | pass | pass | pass | -- | no-mediations |
| FAIL missing_dataschema | FAIL | -- | -- | -- | -- | Fails: `missing_dataschema` |
| FAIL schema_validation_failed | pass | FAIL | -- | -- | -- | Fails: `schema_validation_failed` |
| FAIL unknown_transform | pass | pass | FAIL | -- | -- | Fails: `unknown_transform` |
| FAIL schema_not_found | pass | pass | -- | FAIL | -- | Fails: `schema_not_found` |
| FAIL dispatch_failed | pass | pass | pass | pass | FAIL | Fails: `dispatch_failed` |

> Column headers are abbreviated — see Pipeline for full step names and failure codes.
> `all-skipped` and `no-mediations` short-circuit at step 7 — dispatch is never attempted (shown as `--`).
