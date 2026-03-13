---
title: Validate Processing
parent: Incoming Processing
nav_order: 2
---

# Validate Processing

> Validates a received event's data against its declared JSON Schema. On success, the processing record transitions to Validated and becomes eligible for mediation.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **processing-validated** | Event data passes schema validation | Processing transitions to Validated with a validation timestamp |

> The operation is protected by existence checks and state guards. No state is changed in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `validateProcessing` |
| **Input** | `processingId` |
| **Output** | `ValidatedProcessing` |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Valid event data** | A received processing record whose event data conforms to its declared schema | Processing transitions to validated with a timestamp |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `invalid_incoming_processing` | Fetched processing data fails schema validation | `safeGetIncomingProcessingById` safe dep |
| `invalid_schema` | Resolved schema fails JSON Schema meta-validation | `safeResolveSchema` safe dep |
| `invalid_timestamp` | Generated timestamp fails validation | `safeGenerateTimestamp` safe dep |
| `not_in_received_state` | The processing record is not in received state | `validateProcessingCore` step |
| `schema_validation_failed` | Event data does not conform to the resolved schema | `validateProcessingCore` step |
| `not_found` | No processing record exists for this ID | Own validation |
| `schema_not_found` | No schema could be resolved for the event's dataschema URI | Own validation |

### Assertions

When processing is validated:
- Output status is `validated`
- Validation timestamp is recorded
- All previous fields (event, topic, dataschema URI, received timestamp) are preserved

---

## Pipeline & Decision Table

For the full pipeline table and decision table, see the auto-generated
[validate-processing.spec.md](../../src/domain/incoming-processing/validate-processing/validate-processing.spec.md).

> **STEP** — domain function. Fully testable in isolation with `testSpec`.
> **SAFE-DEP** — infrastructure dependency with runtime validation of returned data.
> **DEP** — infrastructure capability. Injected by the app layer.
