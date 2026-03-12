---
title: Fail Processing
parent: Incoming Processing
nav_order: 4
---

# Fail Processing

> Transitions a non-terminal processing record to "failed" state with a descriptive reason. Can be applied to any processing record in received or validated state. Already-terminal records (mediated or failed) are rejected.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **processing-failed** | The processing record is in a non-terminal state (received or validated) | Processing transitions to failed state with the provided reason and a failure timestamp |

> The operation is protected by input validation and state gate checks. No state is changed in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `failProcessing` |
| **Input** | `processingId`, `reason` (descriptive failure reason) |
| **Output** | `FailedProcessing` |
| **Sync/Async** | Async (shell factory with curried dependency injection) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Fail a received processing** | A received processing record exists. Schema resolution failed upstream. | Processing transitions to failed with reason "schema_not_found". A failure timestamp is recorded. |
| **Fail a validated processing** | A validated processing record exists. An unknown transform was referenced during mediation. | Processing transitions to failed with reason "unknown_transform". A failure timestamp is recorded. |

### Failure Cases

No state is changed in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `not_a_string` | Processing ID is not a string | `parseProcessingId` step |
| `empty` | Processing ID is an empty string | `parseProcessingId` step |
| `too_long_max_64` | Processing ID exceeds 64 characters | `parseProcessingId` step |
| `not_a_uuid` | Processing ID is not a valid UUID | `parseProcessingId` step |
| `script_injection` | Processing ID contains script injection | `parseProcessingId` step |
| `not_a_string` | Failure reason is not a string | `parseProcessingFailureReason` step |
| `empty` | Failure reason is an empty string | `parseProcessingFailureReason` step |
| `too_long_max_4096` | Failure reason exceeds 4096 characters | `parseProcessingFailureReason` step |
| `not_found` | No processing aggregate exists for this ID | `loadState` dep |
| `already_terminal` | Processing is already in a terminal state (mediated or failed) | `failProcessingCore` step |

### Assertions

When processing fails:
- Output status is "failed"
- Processing ID is preserved from state
- Event is preserved from state
- ReceivedAt is preserved from state
- Reason comes from the command
- FailedAt comes from the system clock

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `parseProcessingId` | `STEP` | Parse and validate the processing ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `parseProcessingFailureReason` | `STEP` | Parse and validate the failure reason | `not_a_string`, `empty`, `too_long_max_4096` |
| 3 | `loadState` | `DEP` | Load aggregate state from persistence | -- |
| 4 | `generateFailedAt` | `DEP` | Generate failed timestamp from clock | -- |
| 5 | `failProcessingCore` | `STEP` | Validate state gate and transition to failed | `already_terminal` |
| 6 | `save` | `DEP` | Persist the updated aggregate | -- |

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (persistence, clock).

---

## Decision Table

| Scenario | `parseId` | `parseReason` | `(own)` :not_found | `core` :terminal | Outcome |
|---|:---:|:---:|:---:|:---:|---|
| OK processing-failed | pass | pass | pass | pass | processing-failed |
| FAIL not_a_string (id) | FAIL | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty (id) | FAIL | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_64 | FAIL | -- | -- | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | FAIL | -- | -- | -- | Fails: `not_a_uuid` |
| FAIL script_injection | FAIL | -- | -- | -- | Fails: `script_injection` |
| FAIL not_a_string (reason) | pass | FAIL | -- | -- | Fails: `not_a_string` |
| FAIL empty (reason) | pass | FAIL | -- | -- | Fails: `empty` |
| FAIL too_long_max_4096 | pass | FAIL | -- | -- | Fails: `too_long_max_4096` |
| FAIL not_found | pass | pass | FAIL | -- | Fails: `not_found` |
| FAIL already_terminal | pass | pass | pass | FAIL | Fails: `already_terminal` |

> Column headers are abbreviated — see Pipeline for full step names and failure codes.
