---
title: Deactivate Mediation
parent: Mediation
nav_order: 3
---

# Deactivate Mediation

> Pauses an Active mediation so it no longer processes events. The mediation can be reactivated later.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **mediation-deactivated** | An active mediation is deactivated | Mediation transitions to Deactivated with a deactivation timestamp |

> The operation is protected by state guards. No state is changed in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `deactivateMediation` |
| **Command** | `mediationId` |
| **Output** | `DeactivatedMediation` |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Deactivate an active mediation** | An active mediation for topic `patient.created` | Mediation becomes deactivated with a deactivation timestamp. Pipeline and other fields preserved. |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `not_found` | No mediation exists for the given ID | Shell lookup |
| `not_active` | The mediation is not in active state (draft or already deactivated) | `deactivateMediationCore` step |

### Assertions

When a mediation is deactivated:
- Output status is `deactivated`
- Deactivation timestamp is recorded
- All other fields (topic, destination, pipeline) are preserved

---

## Pipeline & Decision Table

For the full pipeline table and decision table, see the auto-generated
[deactivate-mediation.spec.md](../../src/mediation/deactivate-mediation/deactivate-mediation.spec.md).

> **STEP** — domain function. Fully testable in isolation with `testSpec`.
> **DEP** — infrastructure capability. Injected by the app layer.
