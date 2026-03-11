# deactivate-mediation-shell

> **Operation Specification** · OpenHIM Reusable Mediator · v1.0

---

## 1. Overview

Deactivates an existing mediation, transitioning it from **Active** state to **Deactivated**. Once deactivated, the mediation stops processing events. It can later be reactivated or deleted.

| Outcome | When | Result |
|---|---|---|
| ✅ **mediation-deactivated** | An Active mediation is deactivated | The mediation transitions to Deactivated with a deactivation timestamp |

> The operation is protected by input validation and domain state checks. Only mediations in Active state can be deactivated. No state is changed in any failure case.

---

## 2. Operation Interface

| | |
|---|---|
| **Name** | `deactivateMediation` |
| **Input** | `mediationId` |
| **Output** | `DeactivatedMediation` |
| **Description** | Validates the mediation ID, loads the mediation from storage, verifies it is in Active state, generates a deactivation timestamp, assembles the Deactivated mediation, and persists it. Event processing stops immediately. |

---

## 3. Business Scenarios

### 3.1 Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Mediation deactivated** | Admin deactivates an Active mediation for topic `orders.order-created.v1` routing to `https://openhim.example.org/adapter/dhis2/patient`. | The mediation transitions to Deactivated with a generated deactivation timestamp. All original fields (topic, destination, pipeline, creation and activation dates) are preserved. Event processing stops. |

### 3.2 Failure Cases

No state is modified in any of the following cases.

| Scenario | Given | Outcome |
|---|---|---|
| **Invalid ID type** | Mediation ID is a number instead of a string | Rejected — `not_a_string` |
| **Empty ID** | Mediation ID is an empty string | Rejected — `empty` |
| **ID too long** | Mediation ID exceeds 64 characters | Rejected — `too_long_max_64` |
| **ID not a UUID** | Mediation ID is `not-a-uuid` | Rejected — `not_a_uuid` |
| **ID script injection** | Mediation ID contains `<script>` tags | Rejected — `script_injection` |
| **Not active** | The mediation is in Draft or Deactivated state | Rejected — `not_active` |
| **Mediation not found** | The mediation does not exist in storage | Rejected — `find_failed` |
| **Timestamp generation fails** | Infrastructure cannot produce a timestamp | Rejected — `generate_timestamp_failed` |
| **Persistence fails** | The mediation cannot be saved to storage | Rejected — `save_failed` |

---

## 4. Pipeline

> The shell orchestrates input validation, data fetching, core domain logic, and persistence. Steps execute in sequence — the pipeline short-circuits on the first failure.

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (persistence or external service).

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `parseMediationId` | STEP | Validate the mediation ID format: must be a non-empty UUID string within length bounds. Checks for script injection. | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `findMediation` | DEP | Load the existing mediation from storage by ID. | `find_failed` |
| 3 | `generateTimestamp` | DEP | Produce the current timestamp for the `deactivatedAt` field. | `generate_timestamp_failed` |
| 4 | `deactivateMediationCore` | STEP | Core domain logic: verify the mediation is in Active state and assemble the Deactivated mediation. | `not_active` |
| 5 | `saveMediation` | DEP | Persist the deactivated mediation to storage. | `save_failed` |

---

## 5. Decision Table

> Decision tables show which conditions must hold (✓) or fail (✗) to produce each outcome. A dash (—) means the condition is not evaluated — the pipeline has already terminated at an earlier step.

> Column headers are abbreviated — see §4 for full step names and descriptions.

| Scenario | id str | id empty | id max | id uuid | id xss | state | find | gen ts | save | Outcome |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| ✅ mediation deactivated | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Active mediation deactivated |
| ❌ ID not a string | ✗ | — | — | — | — | — | — | — | — | Fails: `not_a_string` |
| ❌ ID empty | ✓ | ✗ | — | — | — | — | — | — | — | Fails: `empty` |
| ❌ ID too long | ✓ | ✓ | ✗ | — | — | — | — | — | — | Fails: `too_long_max_64` |
| ❌ ID not a UUID | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | Fails: `not_a_uuid` |
| ❌ ID script injection | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | Fails: `script_injection` |
| ❌ not active | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | Fails: `not_active` |
| ❌ mediation not found | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | Fails: `find_failed` |
| ❌ timestamp fails | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | Fails: `generate_timestamp_failed` |
| ❌ save fails | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | Fails: `save_failed` |
