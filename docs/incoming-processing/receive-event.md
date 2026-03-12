---
title: Receive Event
parent: Incoming Processing
nav_order: 1
---

# Receive Event

> Accepts an incoming CloudEvent and creates the initial processing record. Extracts the routing topic from the event type and the schema URI from the dataschema attribute, then persists a new aggregate in "received" state.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **event-received** | A valid CloudEvent arrives with type and dataschema attributes, and no processing record exists for this ID | A new processing record is created in received state, capturing the event, topic, schema URI, and timestamp |

> The operation is protected by input validation and existence checks. No state is created in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `receiveEvent` |
| **Input** | `processingId`, `event` (CloudEvent) |
| **Output** | `ReceivedProcessing` |
| **Sync/Async** | Async (shell factory with curried dependency injection) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **New event received** | A Patient resource CloudEvent arrives with type `org.openhim.patient.created.v1` and a valid dataschema URI. No processing record exists for this ID. | A processing record is created in received state. The topic is extracted from the event type. The dataschema URI is captured for downstream validation. |

### Failure Cases

No state is created in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `not_a_string` | Processing ID is not a string | `parseProcessingId` step |
| `empty` | Processing ID is an empty string | `parseProcessingId` step |
| `too_long_max_64` | Processing ID exceeds 64 characters | `parseProcessingId` step |
| `not_a_uuid` | Processing ID is not a valid UUID | `parseProcessingId` step |
| `script_injection` | Processing ID contains script injection | `parseProcessingId` step |
| `already_exists` | A processing record already exists for this ID | `receiveEventCore` step |
| `missing_event_type` | The CloudEvent does not carry a type attribute | `receiveEventCore` step |
| `missing_dataschema` | The CloudEvent does not carry a dataschema attribute | `receiveEventCore` step |

### Assertions

When event is received:
- Output status is "received"
- Processing ID matches the command
- Topic is extracted from event type
- Dataschema URI is extracted from event dataschema
- The original event is preserved unchanged
- Received timestamp comes from the system clock

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `parseProcessingId` | `STEP` | Parse and validate the processing ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `loadState` | `DEP` | Load existing aggregate state from persistence (null if not found) | -- |
| 3 | `generateReceivedAt` | `DEP` | Generate received timestamp from clock | -- |
| 4 | `receiveEventCore` | `STEP` | Extract event info and assemble ReceivedProcessing | `already_exists`, `missing_event_type`, `missing_dataschema` |
| 5 | `save` | `DEP` | Persist the new aggregate | -- |

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (persistence, clock).

---

## Decision Table

| Scenario | `parseId` | `core` :exists | `core` :type | `core` :schema | Outcome |
|---|:---:|:---:|:---:|:---:|---|
| OK event-received | pass | pass | pass | pass | event-received |
| FAIL not_a_string | FAIL | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | FAIL | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_64 | FAIL | -- | -- | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | FAIL | -- | -- | -- | Fails: `not_a_uuid` |
| FAIL script_injection | FAIL | -- | -- | -- | Fails: `script_injection` |
| FAIL already_exists | pass | FAIL | -- | -- | Fails: `already_exists` |
| FAIL missing_event_type | pass | pass | FAIL | -- | Fails: `missing_event_type` |
| FAIL missing_dataschema | pass | pass | pass | FAIL | Fails: `missing_dataschema` |

> Column headers are abbreviated — see Pipeline for full step names and failure codes.
