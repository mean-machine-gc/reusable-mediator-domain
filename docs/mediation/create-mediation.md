---
title: Create Mediation
parent: Mediation
nav_order: 1
---

# Create Mediation

> Creates a new Mediation in Draft state, capturing the source topic, destination URL, and pipeline configuration. The mediation is not yet active — it must be explicitly activated before it will process events.

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **mediation-created** | Valid topic, destination, and pipeline are provided | A new Draft mediation is persisted with a generated ID and creation timestamp |

> Command validation happens at the API boundary. The shell receives a typed, validated command.

---

## Interface

| | |
|---|---|
| **Name** | `createMediation` |
| **Command** | `topic`, `destination`, `pipeline` |
| **Output** | `DraftMediation` |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Create with filter pipeline** | Topic `patient.created`, destination `https://example.com/webhook`, pipeline with one filter step checking `data.type equals patient` | Draft mediation created with generated UUID and timestamp |

### Failure Cases

No state is modified in any of the following cases. Command validation failures (`invalid_create_mediation_command`) are handled by the command handler before the shell is invoked.

| Failure | When | Source |
|---|---|---|
| `invalid_id` | Generated ID fails schema validation | `safeGenerateId` safe dep |
| `invalid_timestamp` | Generated timestamp fails validation | `safeGenerateTimestamp` safe dep |

### Assertions

When a mediation is created:
- The output is a valid `DraftMediation` with status `draft`
- The topic, destination, and pipeline match the command values
- A unique ID and creation timestamp are assigned

---

## Pipeline & Decision Table

For the full pipeline table and decision table, see the auto-generated
[create-mediation.spec.md](../../src/domain/mediation/create-mediation/create-mediation.spec.md).

> **STEP** — domain function. Fully testable in isolation with `testSpec`.
> **SAFE-DEP** — infrastructure dependency with runtime validation of returned data.
> **DEP** — infrastructure capability. Injected by the app layer.
