---
title: Poll Received
parent: Polling
nav_order: 1
---

# Poll Received

> Fetches a batch of processing records in received state, validates each one
> against its declared JSON Schema, and marks failures accordingly.

---

## Overview

When a CloudEvent is received, it creates a processing record in `received` state.
This poller picks up those records, runs schema validation via the `validateProcessing`
shell, and transitions each record to `validated` or `failed`.

| Outcome | When | Result |
|---|---|---|
| **batch-processed** | At least one received record was found | Each record validated or marked as failed |
| **empty-batch** | No received records in the queue | Nothing to do, empty result |

> Pollers never fail at the poller level. Individual record failures are captured
> in the result summary and the record is transitioned to failed state.

---

## Interface

| | |
|---|---|
| **Name** | `pollReceived` |
| **Input** | `batchSize` |
| **Output** | `PollReceivedResult` — lists of validated and failed processing IDs |
| **Sync/Async** | Async |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **All records validate** | 3 received records, all pass schema validation | Result: 3 validated, 0 failed |
| **Mixed results** | 3 received records, 1 fails schema validation | Result: 2 validated, 1 failed (with error details). Failed record transitioned to failed state. |
| **Empty batch** | No received records in the queue | Result: empty validated, empty failed |

### Failure Cases

The poller itself does not fail. Per-record failures are handled internally:

| Per-record failure | When | Action |
|---|---|---|
| `schema_not_found` | Dataschema URI does not resolve | Record transitioned to failed via `failProcessing` |
| `schema_validation_failed` | Event data does not match schema | Record transitioned to failed via `failProcessing` |
| `not_in_received_state` | Record already advanced (race condition) | Record transitioned to failed via `failProcessing` |

### Assertions

When batch is processed:
- Every record is either validated or failed (all accounted for)
- Every failed entry has at least one error string

When batch is empty:
- No validated entries
- No failed entries

---

## Pipeline

| # | Name | Type | Description |
|---|---|---|---|
| 1 | `fetchReceived` | `DEP` | Fetch up to batchSize processing records in received state |
| 2 | `validateProcessing` | `DEP` | Call validateProcessing shell for a single record |
| 3 | `failProcessing` | `DEP` | Transition a record to failed state on validation failure |
| 4 | `classifyValidationResults` | `STEP` | Split results into validated and failed arrays |

> **STEP** — pure, synchronous function. Tested in isolation.
> **DEP** — async infrastructure dependency or assembled domain shell.
