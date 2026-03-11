# delete-mediation-shell

> **Operation Specification** · OpenHIM Reusable Mediator · v1.0

---

## 1. Overview

Permanently deletes an existing mediation. Only mediations in **Draft** or **Deactivated** state can be deleted — an Active mediation must be deactivated first.

| Outcome | When | Result |
|---|---|---|
| ✅ **mediation-deleted** | A Draft or Deactivated mediation is deleted | The mediation is removed from storage and returned for confirmation |

> The operation is protected by input validation and domain state checks. Active mediations cannot be deleted directly. No state is changed in any failure case.

---

## 2. Operation Interface

| | |
|---|---|
| **Name** | `deleteMediation` |
| **Input** | `mediationId` |
| **Output** | `DraftMediation` or `DeactivatedMediation` |
| **Description** | Validates the mediation ID, loads the mediation from storage, verifies it is in a deletable state (Draft or Deactivated), and removes it from storage. The deleted mediation is returned for audit purposes. |

---

## 3. Business Scenarios

### 3.1 Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Draft mediation deleted** | Admin deletes a Draft mediation for topic `orders.order-created.v1` that was never activated. | The mediation is permanently removed from storage. The deleted mediation is returned for confirmation. |
| **Deactivated mediation deleted** | Admin deletes a Deactivated mediation that was previously active but is no longer needed. | The mediation is permanently removed from storage. The deleted mediation is returned for confirmation. |

### 3.2 Failure Cases

No state is modified in any of the following cases.

| Scenario | Given | Outcome |
|---|---|---|
| **Invalid ID type** | Mediation ID is a number instead of a string | Rejected — `not_a_string` |
| **Empty ID** | Mediation ID is an empty string | Rejected — `empty` |
| **ID too long** | Mediation ID exceeds 64 characters | Rejected — `too_long_max_64` |
| **ID not a UUID** | Mediation ID is `not-a-uuid` | Rejected — `not_a_uuid` |
| **ID script injection** | Mediation ID contains `<script>` tags | Rejected — `script_injection` |
| **Mediation is active** | The mediation is currently in Active state | Rejected — `not_draft_or_deactivated` |
| **Mediation not found** | The mediation does not exist in storage | Rejected — `find_failed` |
| **Deletion fails** | The mediation cannot be removed from storage | Rejected — `delete_failed` |

---

## 4. Pipeline

> The shell orchestrates input validation, data fetching, core domain logic, and persistence. Steps execute in sequence — the pipeline short-circuits on the first failure.

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (persistence or external service).

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `parseMediationId` | STEP | Validate the mediation ID format: must be a non-empty UUID string within length bounds. Checks for script injection. | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `findMediation` | DEP | Load the existing mediation from storage by ID. | `find_failed` |
| 3 | `deleteMediationCore` | STEP | Core domain logic: verify the mediation is in Draft or Deactivated state. Active mediations must be deactivated first. | `not_draft_or_deactivated` |
| 4 | `deleteMediation` | DEP | Permanently remove the mediation from storage. | `delete_failed` |

---

## 5. Decision Table

> Decision tables show which conditions must hold (✓) or fail (✗) to produce each outcome. A dash (—) means the condition is not evaluated — the pipeline has already terminated at an earlier step.

> Column headers are abbreviated — see §4 for full step names and descriptions.

| Scenario | id str | id empty | id max | id uuid | id xss | state | find | delete | Outcome |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| ✅ mediation deleted | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Mediation permanently removed |
| ❌ ID not a string | ✗ | — | — | — | — | — | — | — | Fails: `not_a_string` |
| ❌ ID empty | ✓ | ✗ | — | — | — | — | — | — | Fails: `empty` |
| ❌ ID too long | ✓ | ✓ | ✗ | — | — | — | — | — | Fails: `too_long_max_64` |
| ❌ ID not a UUID | ✓ | ✓ | ✓ | ✗ | — | — | — | — | Fails: `not_a_uuid` |
| ❌ ID script injection | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | Fails: `script_injection` |
| ❌ mediation is active | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | Fails: `not_draft_or_deactivated` |
| ❌ mediation not found | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | Fails: `find_failed` |
| ❌ deletion fails | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | Fails: `delete_failed` |
