---
title: Create Dispatch
parent: Dispatches
nav_order: 1
---

# Create Dispatch

> Creates a new dispatch aggregate in the to-deliver state, linking a CloudEvent to
> a specific destination as determined by the mediation outcome.

---

## Overview

When a mediation produces routing outcomes, each destination receives its own dispatch.
The dispatch captures the event, the originating processing and mediation IDs, and
the target destination URL.

| Outcome | When | Result |
|---|---|---|
| **dispatch-created** | No dispatch exists for this ID | A new `ToDeliverDispatch` aggregate is created |

> The operation is protected by input validation and an existence check.
> No state is changed in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `createDispatch` |
| **Input** | `dispatchId`, `processingId`, `mediationId`, `destination`, `event` |
| **Output** | `ToDeliverDispatch` |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Create from mediation outcome** | No dispatch exists for this ID. Command provides processing ID, mediation ID, destination URL, and the CloudEvent. | A new dispatch is created in to-deliver state with all fields populated and a creation timestamp. |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `not_a_string` | Dispatch ID is not a string | `parseDispatchId` step |
| `empty` | Dispatch ID is an empty string | `parseDispatchId` step |
| `too_long_max_64` | Dispatch ID exceeds 64 characters | `parseDispatchId` step |
| `not_a_uuid` | Dispatch ID is not a valid UUID | `parseDispatchId` step |
| `script_injection` | Dispatch ID contains script injection | `parseDispatchId` step |
| `already_exists` | A dispatch already exists for this ID | Core validation |

### Assertions

When a dispatch is created:
- Output status is `to-deliver`
- Dispatch ID comes from the command
- Processing ID comes from the command
- Mediation ID comes from the command
- Destination comes from the command
- Event comes from the command
- CreatedAt comes from the context (clock)

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `parseDispatchId` | `STEP` | Parse and validate the dispatch ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `loadState` | `DEP` | Load existing aggregate state from persistence (null if not found) | -- |
| 3 | `generateCreatedAt` | `DEP` | Generate created timestamp from clock | -- |
| 4 | `createDispatchCore` | `STEP` | Validate state gate and assemble ToDeliverDispatch | `already_exists` |
| 5 | `save` | `DEP` | Persist the new aggregate | -- |

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (persistence or external service).

---

## Decision Table

| Scenario | `parseDispatchId` | `createDispatchCore` | Outcome |
|---|:---:|:---:|---|
| OK dispatch-created | pass | pass | `ToDeliverDispatch` — new dispatch created |
| FAIL not_a_string | FAIL | -- | Fails: `not_a_string` |
| FAIL empty | FAIL | -- | Fails: `empty` |
| FAIL too_long_max_64 | FAIL | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | FAIL | -- | Fails: `not_a_uuid` |
| FAIL script_injection | FAIL | -- | Fails: `script_injection` |
| FAIL already_exists | pass | FAIL | Fails: `already_exists` |
