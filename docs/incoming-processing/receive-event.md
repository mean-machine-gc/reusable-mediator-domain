---
title: Receive Event
parent: Incoming Processing
nav_order: 1
---

# Receive Event

> Accepts an inbound CloudEvent and creates a new Incoming Processing record in Received state. Extracts the event's topic and dataschema URI for downstream validation and mediation routing.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **event-received** | A valid CloudEvent is received with a new processing ID | A ReceivedProcessing record is created with the event, topic, and schema URI |

> Command validation happens at the API boundary. The shell receives a typed, validated command.

---

## Interface

| | |
|---|---|
| **Name** | `receiveEvent` |
| **Command** | `processingId`, `event` (CloudEvent) |
| **Output** | `ReceivedProcessing` |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Receive a valid CloudEvent** | A CloudEvent with type `org.openhim.patient.created.v1` and a dataschema URI | ReceivedProcessing created with topic extracted from event type and schema URI preserved |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `invalid_incoming_processing` | Fetched processing data fails schema validation | `safeGetIncomingProcessingById` safe dep |
| `invalid_timestamp` | Generated timestamp fails validation | `safeGenerateTimestamp` safe dep |
| `already_exists` | A processing record already exists for this ID | `receiveEventCore` step |
| `missing_event_type` | The CloudEvent does not carry a type attribute | `receiveEventCore` step |
| `missing_dataschema` | The CloudEvent does not carry a dataschema attribute | `receiveEventCore` step |

### Assertions

When an event is received:
- Output status is `received`
- Output ID matches the command's processing ID
- Topic is extracted from the event's type attribute
- Dataschema URI is extracted from the event's dataschema attribute
- The original event is preserved unchanged
- ReceivedAt timestamp comes from the generated context

---

## Pipeline & Decision Table

For the full pipeline table and decision table, see the auto-generated
[receive-event.spec.md](../../src/domain/incoming-processing/receive-event/receive-event.spec.md).

> **STEP** — domain function. Fully testable in isolation with `testSpec`.
> **SAFE-DEP** — infrastructure dependency with runtime validation of returned data.
> **DEP** — infrastructure capability. Injected by the app layer.
