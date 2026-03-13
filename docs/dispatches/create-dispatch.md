---
title: Create Dispatch
parent: Dispatches
nav_order: 1
---

# Create Dispatch

> Creates a new Dispatch in To-deliver state from a mediation routing outcome. Links the dispatch to the originating processing record, mediation, and destination.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **dispatch-created** | A new dispatch is requested for a mediation outcome | A ToDeliverDispatch is created with the event, destination, and a creation timestamp |

> The operation is protected by an idempotency check. No state is changed in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `createDispatch` |
| **Input** | `dispatchId`, `processingId`, `mediationId`, `destination`, `event` |
| **Output** | `ToDeliverDispatch` |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Create a new dispatch** | A mediation routed an event to `https://downstream.example.com/webhook` | Dispatch created in to-deliver state with the event and destination |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `already_exists` | A dispatch with this ID already exists | `createDispatchCore` step |

### Assertions

When a dispatch is created:
- Output status is `to-deliver`
- The event, destination, processing ID, and mediation ID are preserved from the command
- A creation timestamp is assigned

---

## Pipeline & Decision Table

For the full pipeline table and decision table, see the auto-generated
[create-dispatch.spec.md](../../src/dispatches/create-dispatch/create-dispatch.spec.md).

> **STEP** — domain function. Fully testable in isolation with `testSpec`.
> **DEP** — infrastructure capability. Injected by the app layer.
