---
layout: default
title: activateMediation
nav_order: 3
---

# activate-mediation-shell

> **Operation Specification** · OpenHIM Reusable Mediator · v1.0

---

## 1. Overview

Activates an existing mediation, transitioning it from **Draft** or **Deactivated** state to **Active**. Once active, the mediation begins processing events on its configured topic and routing them through its pipeline to the destination endpoint.

| Outcome | When | Result |
|---|---|---|
| ✅ **draft-activated** | A Draft mediation is activated for the first time | The mediation transitions to Active with an activation timestamp |
| ✅ **reactivated** | A previously Deactivated mediation is turned back on | The mediation transitions to Active with a new activation timestamp |

> The operation is protected by input validation and domain state checks. Only mediations in Draft or Deactivated state can be activated. No state is changed in any failure case.

---

## 2. Operation Interface

| | |
|---|---|
| **Name** | `activateMediation` |
| **Input** | `mediationId` |
| **Output** | `ActiveMediation` |
| **Description** | Validates the mediation ID, loads the mediation from storage, verifies it is in an activatable state (Draft or Deactivated), generates an activation timestamp, assembles the Active mediation, and persists it. |

---

## 3. Business Scenarios

### 3.1 Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Draft activated** | Admin activates a Draft mediation for topic `orders.order-created.v1` routing to `https://openhim.example.org/adapter/dhis2/patient`. | The mediation transitions to Active with a generated activation timestamp. It is persisted and returned. Events on the topic will now be processed. |
| **Reactivated** | Admin reactivates a previously Deactivated mediation for the same topic and destination. | The mediation transitions back to Active with a new activation timestamp. Previous deactivation details are replaced. Event processing resumes. |

### 3.2 Failure Cases

No state is modified in any of the following cases.

| Scenario | Given | Outcome |
|---|---|---|
| **Invalid ID type** | Mediation ID is a number instead of a string | Rejected — `not_a_string` |
| **Empty ID** | Mediation ID is an empty string | Rejected — `empty` |
| **ID too long** | Mediation ID exceeds 64 characters | Rejected — `too_long_max_64` |
| **ID not a UUID** | Mediation ID is `not-a-uuid` | Rejected — `not_a_uuid` |
| **ID script injection** | Mediation ID contains `<script>` tags | Rejected — `script_injection` |
| **Already active** | The mediation is already in Active state | Rejected — `not_draft_or_deactivated` |
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
| 3 | `generateTimestamp` | DEP | Produce the current timestamp for the `activatedAt` field. | `generate_timestamp_failed` |
| 4 | `activateMediationCore` | STEP | Core domain logic: verify the mediation is in Draft or Deactivated state, assemble the Active mediation, and classify the success type. | `not_draft_or_deactivated` |
| 5 | `saveMediation` | DEP | Persist the newly activated mediation to storage. | `save_failed` |

---

## 5. Decision Table

> Decision tables show which conditions must hold (✓) or fail (✗) to produce each outcome. A dash (—) means the condition is not evaluated — the pipeline has already terminated at an earlier step.

> Column headers are abbreviated — see §4 for full step names and descriptions.

| Scenario | id str | id empty | id max | id uuid | id xss | state | find | gen ts | save | Outcome |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| ✅ draft activated | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Draft mediation activated for the first time |
| ✅ reactivated | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Deactivated mediation reactivated |
| ❌ ID not a string | ✗ | — | — | — | — | — | — | — | — | Fails: `not_a_string` |
| ❌ ID empty | ✓ | ✗ | — | — | — | — | — | — | — | Fails: `empty` |
| ❌ ID too long | ✓ | ✓ | ✗ | — | — | — | — | — | — | Fails: `too_long_max_64` |
| ❌ ID not a UUID | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | Fails: `not_a_uuid` |
| ❌ ID script injection | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | Fails: `script_injection` |
| ❌ already active | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | Fails: `not_draft_or_deactivated` |
| ❌ mediation not found | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | Fails: `find_failed` |
| ❌ timestamp fails | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | Fails: `generate_timestamp_failed` |
| ❌ save fails | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | Fails: `save_failed` |
