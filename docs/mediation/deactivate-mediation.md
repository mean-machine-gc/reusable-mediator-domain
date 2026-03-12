---
title: Deactivate Mediation
parent: Mediation
nav_order: 3
---

# Deactivate Mediation

> Transitions an Active mediation to Deactivated state. The mediation stops processing incoming events but retains its configuration. It can be reactivated later.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **mediation-deactivated** | An Active mediation is deactivated | Mediation transitions to Deactivated with a deactivation timestamp. Event processing stops. |

> The operation is protected by input validation and state guards. No state is changed in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `deactivateMediation` |
| **Input** | `mediationId` (raw) |
| **Output** | `DeactivatedMediation` |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Deactivate active mediation** | Active mediation for topic `patient.created`, activated on 2025-01-15. Deactivated on 2025-02-01. | Mediation becomes Deactivated. Deactivation timestamp recorded. Events are no longer processed. Configuration preserved for potential reactivation. |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `not_a_string` | Mediation ID is not a string (e.g. a number, null) | `parseMediationId` step |
| `empty` | Mediation ID is an empty string | `parseMediationId` step |
| `too_long_max_64` | Mediation ID exceeds 64 characters | `parseMediationId` step |
| `not_a_uuid` | Mediation ID is not a valid UUID format | `parseMediationId` step |
| `script_injection` | Mediation ID contains injection patterns | `parseMediationId` step |
| `not_active` | Mediation is in Draft or Deactivated state (not active) | `checkDeactivatableState` step |

### Assertions

When a mediation is deactivated:
- Output status is `deactivated`
- Deactivation timestamp is set from the generated context
- All other mediation properties (topic, destination, pipeline) are preserved

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `parseMediationId` | `STEP` | Parse and validate the mediation ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `findMediation` | `DEP` | Fetch mediation from persistence | -- |
| 3 | `generateTimestamp` | `DEP` | Generate deactivation timestamp | -- |
| 4 | `deactivateMediationCore` | `STEP` | Run deactivation core logic | `not_active` |
| 5 | `saveMediation` | `DEP` | Persist the deactivated mediation | -- |

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (persistence or external service).

---

## Decision Table

| Scenario | `parseMediationId` :not_a_string | `parseMediationId` :empty | `parseMediationId` :too_long_max_64 | `parseMediationId` :not_a_uuid | `parseMediationId` :script_injection | `core` :not_active | Outcome |
|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| OK mediation-deactivated | pass | pass | pass | pass | pass | pass | mediation-deactivated |
| FAIL not_a_string | FAIL | -- | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | FAIL | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_64 | pass | pass | FAIL | -- | -- | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | pass | pass | pass | FAIL | -- | -- | Fails: `not_a_uuid` |
| FAIL script_injection | pass | pass | pass | pass | FAIL | -- | Fails: `script_injection` |
| FAIL not_active | pass | pass | pass | pass | pass | FAIL | Fails: `not_active` |
