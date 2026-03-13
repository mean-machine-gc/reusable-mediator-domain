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

> The operation is protected by state guards. No state is changed in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `activateMediation` |
| **Command** | `mediationId` |
| **Output** | `ActiveMediation` |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Activate a draft** | A draft mediation for topic `patient.created` | Mediation becomes active with an activation timestamp |
| **Reactivate after deactivation** | A previously deactivated mediation | Mediation returns to active with a new activation timestamp |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `not_found` | No mediation exists for the given ID | Shell lookup |
| `already_active` | The mediation is already in active state | `activateMediationCore` step |

### Assertions

When a draft is activated:
- Output status is `active`
- Activation timestamp is recorded

When a mediation is reactivated:
- Output status is `active`
- A new activation timestamp replaces the previous one

---

## Pipeline & Decision Table

For the full pipeline table and decision table, see the auto-generated
[activate-mediation.spec.md](../../src/mediation/activate-mediation/activate-mediation.spec.md).

> **STEP** — domain function. Fully testable in isolation with `testSpec`.
> **DEP** — infrastructure capability. Injected by the app layer.
