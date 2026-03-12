---
title: Mediate
parent: Mediation
nav_order: 4
---

# Mediate

> Runs an Active mediation's pipeline against an incoming CloudEvent. The pipeline applies filter steps (which can reject the event) and transform steps (which modify it). If the event passes all filters, the transformed result is returned for routing to the destination.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **event-processed** | Event passes all filter steps and transforms are applied | Transformed CloudEvent ready for routing to the destination |
| **event-skipped** | A filter step rejects the event | Pipeline short-circuits. No transforms applied. Event is not routed. |

> The operation fails only when a transform name is not found in the registry. Filter logic (field resolution, condition evaluation, boolean composition) never produces errors — conditions simply evaluate to true or false.

---

## Interface

| | |
|---|---|
| **Name** | `mediate` |
| **Input** | `event` (CloudEvent), `mediation` (ActiveMediation), `registry` (TransformRegistry) |
| **Output** | `CloudEvent` |
| **Sync/Async** | Sync (core factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Event matches filter and is transformed** | Event with `data.status = "active"`. Pipeline has a filter checking `data.status equals "active"` and a transform `addFlag`. | Event passes the filter. Transform `addFlag` is applied. Transformed event returned. |
| **Empty pipeline passes through** | Active mediation with no pipeline steps. | Event passes through unchanged. No filters, no transforms. |
| **Event rejected by filter** | Event with `data.status = "active"`. Pipeline has a filter checking `data.status equals "inactive"`. | Filter rejects the event. Pipeline short-circuits. Event is skipped. |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `unknown_transform` | A transform name in the pipeline is not found in the transform registry | `executeTransforms` step |

### Assertions

When an event is processed:
- The output is the result of applying all transform functions in sequence
- All filter steps evaluated to match (pass)

When an event is skipped:
- The original event is returned unchanged
- At least one filter step rejected the event

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `executeFilters` | `STEP` | Run all filter steps against the event | -- |
| 2 | `executeTransforms` | `STEP` | Apply all transformations from the registry | `unknown_transform` |

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.

### Filter sub-pipeline

Each filter step is evaluated by `evaluateFilterStep`, which composes:

| # | Name | Type | Description |
|---|---|---|---|
| 1 | `resolveField` | `STEP` | Extract the field value from the CloudEvent using a dot-separated path |
| 2 | `evaluateCondition` | `STRATEGY` | Dispatch to the appropriate operator handler based on the condition type |
| 3 | `composeResults` | `STEP` | Apply `and`/`or` logic to combine individual condition results |

#### Strategy: `evaluateCondition`

The condition operator determines which handler runs. All handlers are pure boolean evaluators — none can fail.

| Handler | Category | Description |
|---|---|---|
| `equals` | Equality | True when field value strictly equals the condition value |
| `not_equals` | Equality | True when field value does not equal the condition value |
| `exists` | Presence | True when field value is not undefined |
| `not_exists` | Presence | True when field value is undefined |
| `contains` | String | True when string field contains the substring |
| `starts_with` | String | True when string field starts with the prefix |
| `ends_with` | String | True when string field ends with the suffix |
| `regex` | String | True when string field matches the regex pattern |
| `greater_than` | Comparison | True when numeric field is greater than the value |
| `less_than` | Comparison | True when numeric field is less than the value |
| `greater_than_or_equal` | Comparison | True when numeric field is greater than or equal to the value |
| `less_than_or_equal` | Comparison | True when numeric field is less than or equal to the value |
| `in` | Collection | True when field value is found in the values list |
| `not_in` | Collection | True when field value is not found in the values list |

> String and comparison operators return `false` (rather than failing) when the field value is not the expected type.

If **any** filter step rejects the event (with `and`/`or` logic), the entire filter pipeline short-circuits with `event-skipped`.

---

## Decision Table

| Scenario | `executeTransforms` :unknown_transform | Outcome |
|---|:---:|---|
| OK event-processed | pass | event-processed |
| OK event-skipped | -- | event-skipped |
| FAIL unknown_transform | FAIL | Fails: `unknown_transform` |

> The `event-skipped` outcome is determined by filter logic before transforms are reached, so the transform column shows `--`.
