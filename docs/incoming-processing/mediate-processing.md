---
title: Mediate Processing
parent: Incoming Processing
nav_order: 3
---

# Mediate Processing

> Records the results of mediation on a validated processing record. The upstream polling mechanism runs the actual mediation pipeline and passes the outcomes (dispatched or skipped per mediation) into this operation, which transitions the processing record to "mediated" state.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **processing-mediated** | The processing record is in validated state and mediation outcomes are provided | Processing transitions to mediated state with outcomes attached and a mediated timestamp |

> This operation does not run the mediation itself — it records the outcome. The upstream caller is responsible for executing the mediation pipeline and computing the outcomes before calling this operation.

---

## Interface

| | |
|---|---|
| **Name** | `mediateProcessing` |
| **Input** | `processingId`, `outcomes` (list of mediation outcomes — dispatched or skipped per mediation) |
| **Output** | `MediatedProcessing` |
| **Sync/Async** | Async (shell factory with curried dependency injection) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Mediated with mixed outcomes** | A validated processing record exists. The upstream caller mediated the event: one mediation dispatched to SHR, another was skipped because its filter rejected the event. | Processing transitions to mediated. Both outcomes (dispatched and skipped) are attached. A mediated timestamp is recorded. |
| **Mediated with no outcomes** | A validated processing record exists. No active mediations matched the event's topic. | Processing transitions to mediated with an empty outcomes list. |

### Failure Cases

No state is changed in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `not_a_string` | Processing ID is not a string | `parseProcessingId` step |
| `empty` | Processing ID is an empty string | `parseProcessingId` step |
| `too_long_max_64` | Processing ID exceeds 64 characters | `parseProcessingId` step |
| `not_a_uuid` | Processing ID is not a valid UUID | `parseProcessingId` step |
| `script_injection` | Processing ID contains script injection | `parseProcessingId` step |
| `not_found` | No processing aggregate exists for this ID | `loadState` dep |
| `not_in_validated_state` | Processing is not in validated state (received, already mediated, or failed) | `mediateProcessingCore` step |

### Assertions

When processing is mediated:
- Output status is "mediated"
- Processing ID is preserved from state
- Event is preserved from state
- ReceivedAt is preserved from state
- ValidatedAt is preserved from state
- MediatedAt comes from the system clock
- Outcomes come from the command

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `parseProcessingId` | `STEP` | Parse and validate the processing ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `loadState` | `DEP` | Load aggregate state from persistence | -- |
| 3 | `generateMediatedAt` | `DEP` | Generate mediated timestamp from clock | -- |
| 4 | `mediateProcessingCore` | `STEP` | Attach outcomes and transition to mediated | `not_in_validated_state` |
| 5 | `save` | `DEP` | Persist the updated aggregate | -- |

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (persistence, clock).

---

## Decision Table

| Scenario | `parseId` | `(own)` :not_found | `core` :state | Outcome |
|---|:---:|:---:|:---:|---|
| OK processing-mediated | pass | pass | pass | processing-mediated |
| FAIL not_a_string | FAIL | -- | -- | Fails: `not_a_string` |
| FAIL empty | FAIL | -- | -- | Fails: `empty` |
| FAIL too_long_max_64 | FAIL | -- | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | FAIL | -- | -- | Fails: `not_a_uuid` |
| FAIL script_injection | FAIL | -- | -- | Fails: `script_injection` |
| FAIL not_found | pass | FAIL | -- | Fails: `not_found` |
| FAIL not_in_validated_state | pass | pass | FAIL | Fails: `not_in_validated_state` |

> Column headers are abbreviated — see Pipeline for full step names and failure codes.
