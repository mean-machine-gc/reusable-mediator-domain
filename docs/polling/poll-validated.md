---
title: Poll Validated
parent: Polling
nav_order: 2
---

# Poll Validated

> Fetches a batch of Validated processing records, runs all matching active mediations against each event, creates dispatches for routed outcomes, and transitions each processing record to Mediated or Failed.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **batch-processed** | One or more validated records are found | Each record is mediated (with dispatches created) or failed; results returned |
| **empty-batch** | No validated records are found | Returns empty result arrays |

This is the most complex poller — it orchestrates mediation evaluation, dispatch creation, and processing state transitions in a single batch operation.

---

## Interface

| | |
|---|---|
| **Name** | `pollValidated` |
| **Input** | `batchSize` |
| **Output** | `PollValidatedResult` — `{ mediated, failed }` arrays |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Event routed to two destinations** | A validated event with topic `patient.created` matching two active mediations | Two dispatches created, processing transitions to mediated with two dispatched outcomes |
| **Event filtered by all mediations** | A validated event that doesn't match any mediation's filter | Processing transitions to mediated with all skipped outcomes, no dispatches created |
| **No validated records** | No records in validated state | Empty result returned |

### Assertions

When a batch is processed:
- Dispatches include destination information
- Failed entries include error information

When the batch is empty:
- Result arrays are empty

---

## Pipeline & Decision Table

For the full pipeline table and decision table, see the auto-generated
[poll-validated.spec.md](../../src/polling/poll-validated/poll-validated.spec.md).

> **STEP** — domain function. Fully testable in isolation with `testSpec`.
> **DEP** — infrastructure capability. Injected by the app layer.
