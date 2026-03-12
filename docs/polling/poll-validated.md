---
title: Poll Validated
parent: Polling
nav_order: 2
---

# Poll Validated

> Fetches validated processing records, runs all matching mediations for each,
> creates dispatches for routed results, and records the outcomes on the processing record.

---

## Overview

This is the most complex poller. For each validated processing record, it finds all
active mediations matching the event's topic, runs each mediation's filter/transform
pipeline, creates a dispatch for every routed result, and transitions the processing
record to mediated with the collected outcomes.

| Outcome | When | Result |
|---|---|---|
| **batch-processed** | At least one validated record was found | Each record mediated or marked as failed |
| **empty-batch** | No validated records in the queue | Nothing to do, empty result |

> Pollers never fail at the poller level. If a mediation pipeline fails (e.g. unknown
> transform), the processing record is transitioned to failed and included in the
> failure summary.

---

## Interface

| | |
|---|---|
| **Name** | `pollValidated` |
| **Input** | `batchSize` |
| **Output** | `PollValidatedResult` — mediated entries (with dispatch + skip detail) and failed entries |
| **Sync/Async** | Async |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Event routed to 2 destinations** | A validated record matches 2 active mediations. Both pass filters. | 2 dispatches created, processing transitioned to mediated with 2 dispatched outcomes. |
| **Event routed to 1, skipped by 1** | A validated record matches 2 mediations. One passes filters, one is filtered out. | 1 dispatch created, processing transitioned to mediated with 1 dispatched + 1 skipped outcome. |
| **No active mediations** | A validated record's topic has no active mediations. | Processing transitioned to mediated with empty outcomes. No dispatches created. |
| **Empty batch** | No validated records in the queue. | Empty result. |

### Failure Cases

Per-record failures are handled internally:

| Per-record failure | When | Action |
|---|---|---|
| `unknown_transform` | A mediation references an unregistered transform function | Record transitioned to failed via `failProcessing` |
| Infrastructure error | Database or network failure during dispatch creation | Record transitioned to failed via `failProcessing` |

### Assertions

When batch is processed:
- At least one record was processed
- Every dispatch entry has a destination
- Every failed entry has at least one error string

When batch is empty:
- No mediated entries
- No failed entries

---

## Pipeline

| # | Name | Type | Description |
|---|---|---|---|
| 1 | `fetchValidated` | `DEP` | Fetch up to batchSize processing records in validated state |
| 2 | `findActiveMediationsByTopic` | `DEP` | Find all active mediations matching a topic |
| 3 | `getTransformRegistry` | `DEP` | Retrieve the transform function registry |
| 4 | `mediateAll` | `STEP` | Run all mediations for an event, collect outcomes (dispatched/skipped) |
| 5 | `generateDispatchId` | `DEP` | Generate a unique dispatch ID for each routed result |
| 6 | `createDispatch` | `DEP` | Create a dispatch aggregate for a routed mediation result |
| 7 | `mediateProcessing` | `DEP` | Transition processing record to mediated with outcomes |
| 8 | `failProcessing` | `DEP` | Transition a record to failed state on error |

> **STEP** — pure, synchronous function. `mediateAll` runs `mediateCore` for each
> mediation, collecting `MediationOutcome[]`. Tested in isolation with full examples.
> **DEP** — async infrastructure dependency or assembled domain shell.
