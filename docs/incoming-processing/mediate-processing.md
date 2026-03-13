---
title: Mediate Processing
parent: Incoming Processing
nav_order: 3
---

# Mediate Processing

> Records the results of running all matching mediations against a validated event. The processing record transitions to Mediated with an array of outcomes — each mediation either dispatched (routed to a destination) or skipped (filtered out).

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **processing-mediated** | Mediation outcomes are attached to the processing record | Processing transitions to Mediated with outcomes and a mediation timestamp |

> The operation is protected by existence checks and state guards. No state is changed in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `mediateProcessing` |
| **Input** | `processingId`, `outcomes` (MediationOutcome[]) |
| **Output** | `MediatedProcessing` |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **All mediations dispatched** | Two active mediations both route the event | Processing transitions to mediated with two dispatched outcomes |
| **Mixed outcomes** | One mediation routes, another filters out the event | Processing transitions to mediated with one dispatched and one skipped outcome |
| **All skipped** | No mediations match the event | Processing transitions to mediated with all skipped outcomes |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `invalid_incoming_processing` | Fetched processing data fails schema validation | `safeGetIncomingProcessingById` safe dep |
| `invalid_timestamp` | Generated timestamp fails validation | `safeGenerateTimestamp` safe dep |
| `not_in_validated_state` | The processing record is not in validated state | `mediateProcessingCore` step |
| `not_found` | No processing record exists for this ID | Own validation |

### Assertions

When processing is mediated:
- Output status is `mediated`
- Mediation timestamp is recorded
- Outcomes array is attached to the processing record

---

## Pipeline & Decision Table

For the full pipeline table and decision table, see the auto-generated
[mediate-processing.spec.md](../../src/incoming-processing/mediate-processing/mediate-processing.spec.md).

> **STEP** — domain function. Fully testable in isolation with `testSpec`.
> **SAFE-DEP** — infrastructure dependency with runtime validation of returned data.
> **DEP** — infrastructure capability. Injected by the app layer.
