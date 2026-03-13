---
title: Record Delivery
parent: Dispatches
nav_order: 2
---

# Record Delivery

> Attempts HTTP delivery for a dispatch and records the outcome. Depending on the attempt result and retry budget, the dispatch transitions to delivered, attempted (retry pending), or failed (max retries exhausted).

---

## Overview

| Outcome | When | Result |
|---|---|---|
| **delivered** | HTTP delivery succeeds | Dispatch transitions to Delivered with a delivery timestamp |
| **attempt-recorded** | Delivery fails but retries remain | Dispatch transitions to Attempted, failed attempt appended |
| **max-attempts-exhausted** | Delivery fails and max retries reached | Dispatch transitions to Failed with a failure timestamp |

> The operation is protected by existence checks and state guards. No state is changed in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `recordDelivery` |
| **Input** | `dispatchId` |
| **Output** | `DeliveredDispatch`, `AttemptedDispatch`, or `FailedDispatch` |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **First attempt succeeds** | Dispatch is in to-deliver state. HTTP delivery returns 200 OK. | Dispatch transitions to delivered. Attempt recorded with status code, response body, headers, and response time. |
| **Retry available** | Dispatch has 1 previous failed attempt (max 3). Delivery returns 503. | Dispatch transitions to attempted with 2 total attempts. Retry is still possible. |
| **Max retries exhausted** | Dispatch has 2 previous failed attempts (max 3). Third attempt returns 503. | Dispatch transitions to failed with 3 total attempts. |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `invalid_dispatch` | Fetched dispatch data fails schema validation | `safeGetDispatchById` safe dep |
| `invalid_delivery_attempt` | HTTP delivery result fails DeliveryAttempt schema validation | `safeDeliver` safe dep |
| `already_terminal` | Dispatch is already delivered or failed | `recordDeliveryCore` step |
| `not_found` | No dispatch exists for the given ID | Own validation |

### Assertions

When delivered:
- Output status is `delivered`
- The new attempt is appended to the attempts list
- Attempt count incremented by one
- DeliveredAt equals the successful attempt timestamp

When attempt is recorded:
- Output status is `attempted`
- The new attempt is appended to the attempts list
- Attempt count is below max attempts

When max attempts are exhausted:
- Output status is `failed`
- Attempt count equals max attempts
- FailedAt equals the last attempt timestamp

---

## Pipeline & Decision Table

For the full pipeline table and decision table, see the auto-generated
[record-delivery.spec.md](../../src/dispatches/record-delivery/record-delivery.spec.md).

> **STEP** — domain function. Fully testable in isolation with `testSpec`.
> **SAFE-DEP** — infrastructure dependency with runtime validation of returned data.
> **DEP** — infrastructure capability. Injected by the app layer.
