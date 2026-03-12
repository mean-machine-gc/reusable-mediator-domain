---
title: Poll Dispatches
parent: Polling
nav_order: 3
---

# Poll Dispatches

> Fetches dispatches pending delivery, attempts HTTP delivery for each, and
> classifies outcomes into delivered, retrying, or exhausted.

---

## Overview

This poller drives the delivery retry loop. It picks up dispatches in `to-deliver`
or `attempted` state, calls the `recordDelivery` shell for each (which performs the
actual HTTP request), and classifies the outcome based on the success type returned.

| Outcome | When | Result |
|---|---|---|
| **batch-processed** | At least one dispatch was found | Each dispatch attempted and classified |
| **empty-batch** | No dispatches pending delivery | Nothing to do, empty result |

> The `recordDelivery` shell handles the full delivery lifecycle internally —
> performing the HTTP request, recording the attempt, and transitioning state.
> The poller simply invokes it and classifies the result.

---

## Interface

| | |
|---|---|
| **Name** | `pollDispatches` |
| **Input** | `batchSize` |
| **Output** | `PollDispatchesResult` — lists of delivered, retrying, and exhausted dispatch IDs |
| **Sync/Async** | Async |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **All deliveries succeed** | 3 dispatches in to-deliver state. All HTTP requests return 200. | Result: 3 delivered, 0 retrying, 0 exhausted. |
| **Mixed outcomes** | 3 dispatches. One succeeds (200), one fails but has retries left (503), one exhausts max attempts. | Result: 1 delivered, 1 retrying, 1 exhausted. |
| **All retrying** | 2 dispatches in to-deliver state. Both HTTP requests return 503. Max attempts is 3. | Result: 0 delivered, 2 retrying, 0 exhausted. |
| **Empty batch** | No dispatches pending delivery. | Empty result. |

### Failure Cases

The poller itself does not fail. The `recordDelivery` shell handles per-dispatch
outcomes internally. The three possible outcomes are:

| Outcome | recordDelivery successType | Meaning |
|---|---|---|
| **delivered** | `delivered` | HTTP request succeeded, dispatch is terminal |
| **retrying** | `attempt-recorded` | HTTP request failed, retries remain |
| **exhausted** | `max-attempts-exhausted` | HTTP request failed, no retries left, dispatch is terminal |

### Assertions

When batch is processed:
- At least one dispatch was processed
- No dispatch ID appears in more than one outcome category

When batch is empty:
- No delivered entries
- No retrying entries
- No exhausted entries

---

## Pipeline

| # | Name | Type | Description |
|---|---|---|---|
| 1 | `fetchDispatches` | `DEP` | Fetch up to batchSize dispatches in to-deliver or attempted state |
| 2 | `recordDelivery` | `DEP` | Call recordDelivery shell — attempts HTTP delivery and records outcome |
| 3 | `classifyDeliveryResults` | `STEP` | Classify delivery outcomes into delivered, retrying, exhausted |

> **STEP** — pure, synchronous function. Maps `recordDelivery` success types to
> the three output categories. Tested in isolation.
> **DEP** — async infrastructure dependency or assembled domain shell.
