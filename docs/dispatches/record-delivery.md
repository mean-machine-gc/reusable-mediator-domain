---
title: Record Delivery
parent: Dispatches
nav_order: 2
---

# Record Delivery

> Records a delivery attempt against a dispatch. Depending on the attempt result and
> retry budget, the dispatch transitions to delivered, attempted (retry pending),
> or failed (max retries exhausted).

---

## Overview

After the shell performs the actual HTTP delivery, it passes the outcome to the core
as a `DeliveryAttempt`. The core evaluates the attempt result and the current retry
count to determine the next state.

| Outcome | When | Result |
|---|---|---|
| **delivered** | Attempt succeeded | Dispatch transitions to `delivered` with delivery timestamp |
| **attempt-recorded** | Attempt failed, retries remain | Dispatch transitions to `attempted`, attempt appended |
| **max-attempts-exhausted** | Attempt failed, max retries reached | Dispatch transitions to `failed` with failure timestamp |

> The operation is protected by input validation, an existence check, and a state gate.
> No state is changed in any failure case.

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
| **Retry succeeds** | Dispatch has 1 previous failed attempt (max 3). Retry returns 200 OK. | Dispatch transitions to delivered with 2 total attempts. DeliveredAt set from the successful attempt timestamp. |
| **First attempt fails, retries remain** | Dispatch is in to-deliver state. HTTP delivery returns 503. Max attempts is 3. | Dispatch transitions to attempted with 1 attempt recorded. Retry is still possible. |
| **Final retry fails** | Dispatch has 2 previous failed attempts (max 3). Third attempt returns 503. | Dispatch transitions to failed with 3 total attempts. FailedAt set from the last attempt timestamp. |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `not_a_string` | Dispatch ID is not a string | `parseDispatchId` step |
| `empty` | Dispatch ID is an empty string | `parseDispatchId` step |
| `too_long_max_64` | Dispatch ID exceeds 64 characters | `parseDispatchId` step |
| `not_a_uuid` | Dispatch ID is not a valid UUID | `parseDispatchId` step |
| `script_injection` | Dispatch ID contains script injection | `parseDispatchId` step |
| `not_found` | No dispatch exists for this ID | Shell validation |
| `already_terminal` | Dispatch is already delivered or failed | Core state gate |

### Assertions

When delivered:
- Output status is `delivered`
- The new attempt is appended to the attempts list
- Attempt count is previous count plus one
- Attempts array length equals attempt count
- DeliveredAt equals the successful attempt timestamp

When attempt is recorded (retry pending):
- Output status is `attempted`
- The new attempt is appended to the attempts list
- Attempt count is previous count plus one
- Attempts array length equals attempt count
- Attempt count is below max attempts

When max attempts are exhausted:
- Output status is `failed`
- The new attempt is appended to the attempts list
- Attempt count is previous count plus one
- Attempts array length equals attempt count
- Attempt count equals max attempts

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `parseDispatchId` | `STEP` | Parse and validate the dispatch ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `loadState` | `DEP` | Load aggregate state from persistence | -- |
| 3 | `deliver` | `DEP` | Attempt HTTP delivery to destination, returns DeliveryAttempt | -- |
| 4 | `getMaxAttempts` | `DEP` | Retrieve the max attempts configuration | -- |
| 5 | `recordDeliveryCore` | `STEP` | Evaluate attempt result, transition state accordingly | `already_terminal` |
| 6 | `save` | `DEP` | Persist the updated aggregate | -- |

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (persistence or external service).

---

## Decision Table

| Scenario | `parseDispatchId` | `recordDeliveryCore` | Outcome |
|---|:---:|:---:|---|
| OK delivered | pass | pass | `DeliveredDispatch` — attempt succeeded |
| OK attempt-recorded | pass | pass | `AttemptedDispatch` — failed but retries remain |
| OK max-attempts-exhausted | pass | pass | `FailedDispatch` — max retries reached |
| FAIL not_a_string | FAIL | -- | Fails: `not_a_string` |
| FAIL empty | FAIL | -- | Fails: `empty` |
| FAIL too_long_max_64 | FAIL | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | FAIL | -- | Fails: `not_a_uuid` |
| FAIL script_injection | FAIL | -- | Fails: `script_injection` |
| FAIL not_found | pass | -- | Fails: `not_found` (shell check before core) |
| FAIL already_terminal | pass | FAIL | Fails: `already_terminal` |
