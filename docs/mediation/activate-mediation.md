---
title: Activate Mediation
parent: Mediation
nav_order: 2
---

# Activate Mediation

> Transitions a Draft or Deactivated mediation to Active state. Once active, the mediation will process incoming CloudEvents on its configured topic through its pipeline and route results to the destination.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **draft-activated** | A mediation in Draft state is activated | Mediation transitions to Active with an activation timestamp |
| **reactivated** | A previously Deactivated mediation is activated again | Mediation returns to Active with a new activation timestamp |

> The operation is protected by input validation and state guards. No state is changed in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `activateMediation` |
| **Input** | `mediationId` (raw) |
| **Output** | `ActiveMediation` |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Activate a draft** | Draft mediation for topic `patient.created` with destination `https://example.com/webhook` | Mediation becomes Active. Activation timestamp recorded. Pipeline is now live. |
| **Reactivate after deactivation** | Mediation was previously active, then deactivated on 2025-02-01. Now reactivated on 2025-03-01. | Mediation becomes Active again with the new activation timestamp. Previous deactivation history is dropped. |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `not_a_string` | Mediation ID is not a string (e.g. a number, null) | `parseMediationId` step |
| `empty` | Mediation ID is an empty string | `parseMediationId` step |
| `too_long_max_64` | Mediation ID exceeds 64 characters | `parseMediationId` step |
| `not_a_uuid` | Mediation ID is not a valid UUID format | `parseMediationId` step |
| `script_injection` | Mediation ID contains injection patterns | `parseMediationId` step |
| `already_active` | Mediation is already in Active state | `checkActivatableState` step |

### Assertions

When a draft is activated:
- Output status is `active`
- Input state was `draft`
- Activation timestamp is set from the generated context

When a mediation is reactivated:
- Output status is `active`
- Input state was `deactivated`
- A fresh activation timestamp replaces the previous one

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `parseMediationId` | `STEP` | Parse and validate the mediation ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `findMediation` | `DEP` | Fetch mediation from persistence | -- |
| 3 | `generateTimestamp` | `DEP` | Generate activation timestamp | -- |
| 4 | `activateMediationCore` | `STEP` | Run activation core logic | `already_active` |
| 5 | `saveMediation` | `DEP` | Persist the activated mediation | -- |

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (persistence or external service).

---

## Decision Table

| Scenario | `parseMediationId` :not_a_string | `parseMediationId` :empty | `parseMediationId` :too_long_max_64 | `parseMediationId` :not_a_uuid | `parseMediationId` :script_injection | `core` :already_active | Outcome |
|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| OK draft-activated | pass | pass | pass | pass | pass | pass | draft-activated |
| OK reactivated | pass | pass | pass | pass | pass | pass | reactivated |
| FAIL not_a_string | FAIL | -- | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | FAIL | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_64 | pass | pass | FAIL | -- | -- | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | pass | pass | pass | FAIL | -- | -- | Fails: `not_a_uuid` |
| FAIL script_injection | pass | pass | pass | pass | FAIL | -- | Fails: `script_injection` |
| FAIL already_active | pass | pass | pass | pass | pass | FAIL | Fails: `already_active` |
