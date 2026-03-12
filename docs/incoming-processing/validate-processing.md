---
title: Validate Processing
parent: Incoming Processing
nav_order: 2
---

# Validate Processing

> Validates the event data of a received processing record against its declared JSON Schema. On success, the processing record transitions from "received" to "validated", confirming the event payload conforms to the expected structure.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **processing-validated** | The event data conforms to the resolved JSON Schema | Processing transitions to validated state with a validation timestamp |

> The operation is protected by input validation, state checks, and schema resolution. No state is changed in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `validateProcessing` |
| **Input** | `processingId` |
| **Output** | `ValidatedProcessing` |
| **Sync/Async** | Async (shell factory with curried dependency injection) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Schema validation passes** | A received processing record exists. The schema registry returns a JSON Schema for the event's dataschema URI. The event data conforms to that schema. | Processing transitions to validated. All previous fields are preserved. A validated timestamp is recorded. |

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
| `schema_not_found` | The dataschema URI does not resolve to a known schema | `resolveSchema` dep |
| `not_in_received_state` | Processing is not in received state (already validated, mediated, or failed) | `validateProcessingCore` step |
| `schema_validation_failed` | Event data does not conform to the resolved JSON Schema | `validateProcessingCore` step |

### Assertions

When processing is validated:
- Output status is "validated"
- Processing ID is preserved from state
- Event is preserved from state
- ReceivedAt is preserved from state
- ValidatedAt comes from the system clock

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `parseProcessingId` | `STEP` | Parse and validate the processing ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `loadState` | `DEP` | Load aggregate state from persistence | -- |
| 3 | `resolveSchema` | `DEP` | Resolve JSON Schema from registry using dataschemaUri | -- |
| 4 | `generateValidatedAt` | `DEP` | Generate validated timestamp from clock | -- |
| 5 | `validateProcessingCore` | `STEP` | Validate event data against schema and transition to validated | `not_in_received_state`, `schema_validation_failed` |
| 6 | `save` | `DEP` | Persist the updated aggregate | -- |

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (persistence, schema registry, clock).

---

## Decision Table

| Scenario | `parseId` | `(own)` :not_found | `(own)` :schema_404 | `core` :state | `core` :schema_fail | Outcome |
|---|:---:|:---:|:---:|:---:|:---:|---|
| OK processing-validated | pass | pass | pass | pass | pass | processing-validated |
| FAIL not_a_string | FAIL | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | FAIL | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_64 | FAIL | -- | -- | -- | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | FAIL | -- | -- | -- | -- | Fails: `not_a_uuid` |
| FAIL script_injection | FAIL | -- | -- | -- | -- | Fails: `script_injection` |
| FAIL not_found | pass | FAIL | -- | -- | -- | Fails: `not_found` |
| FAIL schema_not_found | pass | pass | FAIL | -- | -- | Fails: `schema_not_found` |
| FAIL not_in_received_state | pass | pass | pass | FAIL | -- | Fails: `not_in_received_state` |
| FAIL schema_validation_failed | pass | pass | pass | pass | FAIL | Fails: `schema_validation_failed` |

> Column headers are abbreviated — see Pipeline for full step names and failure codes.
