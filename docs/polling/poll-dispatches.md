---
title: Poll Dispatches
parent: Polling
nav_order: 3
---

# Poll Dispatches

> Fetches a batch of pending dispatches (to-deliver or attempted) and attempts HTTP delivery for each. Dispatches transition to delivered, attempted (retry pending), or failed (max retries exhausted) based on the delivery result and retry budget.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **batch-processed** | One or more pending dispatches are found | Each dispatch is delivered, retried, or failed; results returned as classified arrays |
| **empty-batch** | No pending dispatches are found | Returns empty result arrays |

---

## Interface

| | |
|---|---|
| **Name** | `pollDispatches` |
| **Input** | `batchSize` |
| **Output** | `PollDispatchesResult` — `{ delivered, retrying, exhausted }` arrays |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **All deliveries succeed** | Three pending dispatches, all return 200 OK | Three dispatches transition to delivered |
| **Mixed results** | One succeeds, one fails with retries left, one exhausts retries | Results classified into delivered, retrying, and exhausted arrays |
| **No pending dispatches** | No to-deliver or attempted dispatches | Empty result returned |

### Assertions

When a batch is processed:
- No duplicate dispatch IDs in results

When the batch is empty:
- Result arrays are empty

---

## Pipeline & Decision Table

For the full pipeline table and decision table, see the auto-generated
[poll-dispatches.spec.md](../../src/polling/poll-dispatches/poll-dispatches.spec.md).

> **STEP** — domain function. Fully testable in isolation with `testSpec`.
> **SAFE-DEP** — infrastructure dependency with runtime validation of returned data.
> **DEP** — infrastructure capability. Injected by the app layer.
