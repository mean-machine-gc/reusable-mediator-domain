---
title: Poll Received
parent: Polling
nav_order: 1
---

# Poll Received

> Fetches a batch of Received processing records and validates each against its declared JSON Schema. Records that pass validation transition to Validated; those that fail transition to Failed.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **batch-processed** | One or more received records are found | Each record is validated or failed; results returned as validated/failed arrays |
| **empty-batch** | No received records are found | Returns empty result arrays |

---

## Interface

| | |
|---|---|
| **Name** | `pollReceived` |
| **Input** | `batchSize` |
| **Output** | `PollReceivedResult` — `{ validated, failed }` arrays |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **All records validate** | Three received records with valid schemas | All three transition to validated |
| **Mixed results** | Two valid records, one with missing schema | Two validated, one failed with reason |
| **No records** | No received records in the batch | Empty result returned |

### Assertions

When a batch is processed:
- Failed entries include error information
- No duplicate processing IDs in results

When the batch is empty:
- Result arrays are empty

---

## Pipeline & Decision Table

For the full pipeline table and decision table, see the auto-generated
[poll-received.spec.md](../../src/polling/poll-received/poll-received.spec.md).

> **STEP** — domain function. Fully testable in isolation with `testSpec`.
> **SAFE-DEP** — infrastructure dependency with runtime validation of returned data.
> **DEP** — infrastructure capability. Injected by the app layer.
