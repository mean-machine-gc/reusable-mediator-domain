---
title: Fail Processing
parent: Incoming Processing
nav_order: 4
---

# Fail Processing

> Transitions a processing record to the terminal Failed state with a reason. This can happen at any non-terminal stage — received, validated, or mediated — when an unrecoverable error occurs.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **processing-failed** | A processing record is failed with a reason | Processing transitions to Failed with the reason and a failure timestamp |

> The operation is protected by existence checks and state guards. No state is changed in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `failProcessing` |
| **Input** | `processingId`, `reason` |
| **Output** | `FailedProcessing` |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Fail a received processing** | A received event that cannot be validated | Processing transitions to failed with the given reason and a failure timestamp |
| **Fail a validated processing** | A validated event whose mediations encounter an error | Processing transitions to failed |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `not_found` | No processing record exists for this ID | Shell lookup |
| `already_terminal` | The processing record is already in failed state | `failProcessingCore` step |

### Assertions

When processing is failed:
- Output status is `failed`
- Failure reason is recorded
- Failure timestamp is recorded

---

## Pipeline & Decision Table

For the full pipeline table and decision table, see the auto-generated
[fail-processing.spec.md](../../src/incoming-processing/fail-processing/fail-processing.spec.md).

> **STEP** — domain function. Fully testable in isolation with `testSpec`.
> **DEP** — infrastructure capability. Injected by the app layer.
