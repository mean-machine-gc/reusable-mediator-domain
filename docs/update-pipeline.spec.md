---
layout: default
title: updatePipeline
nav_order: 5
---

# update-pipeline-shell

> **Operation Specification** · OpenHIM Reusable Mediator · v1.0

---

## 1. Overview

Replaces the pipeline configuration on an existing mediation. The mediation must be in **Draft** or **Deactivated** state — an Active mediation's pipeline cannot be modified directly (deactivate it first, update, then reactivate).

| Outcome | When | Result |
|---|---|---|
| ✅ **pipeline-updated** | A Draft or Deactivated mediation's pipeline is replaced | The mediation is persisted with the new pipeline; status is preserved |

> The operation is protected by input validation on both the mediation ID and the new pipeline structure, plus domain state checks. No state is changed in any failure case.

---

## 2. Operation Interface

| | |
|---|---|
| **Name** | `updatePipeline` |
| **Input** | `mediationId`, `pipeline` |
| **Output** | `DraftMediation` or `DeactivatedMediation` |
| **Description** | Validates the mediation ID and the new pipeline structure, loads the mediation from storage, verifies it is in an updatable state (Draft or Deactivated), replaces the pipeline, and persists the updated mediation. The mediation's status and all other fields are preserved. |

---

## 3. Business Scenarios

### 3.1 Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Draft pipeline updated** | Admin updates the pipeline of a Draft mediation for topic `orders.order-created.v1`, replacing a single filter (event type equals `patient-created`) with an OR filter matching both `patient-created` and `patient-updated`. | The mediation remains in Draft with the new pipeline applied. All other fields are unchanged. |
| **Deactivated pipeline updated** | Admin updates the pipeline of a Deactivated mediation before reactivating it. | The mediation remains in Deactivated with the new pipeline applied. It can be reactivated afterward. |

### 3.2 Failure Cases

No state is modified in any of the following cases.

| Scenario | Given | Outcome |
|---|---|---|
| **Invalid ID type** | Mediation ID is a number instead of a string | Rejected — `not_a_string` |
| **Empty ID** | Mediation ID is an empty string | Rejected — `empty` |
| **ID too long** | Mediation ID exceeds 64 characters | Rejected — `too_long_max_64` |
| **ID not a UUID** | Mediation ID is `not-a-uuid` | Rejected — `not_a_uuid` |
| **ID script injection** | Mediation ID contains `<script>` tags | Rejected — `script_injection` |
| **Pipeline not an array** | Pipeline is a string or object instead of an array | Rejected — `not_an_array` |
| **Pipeline empty** | Pipeline is an empty array | Rejected — `empty` |
| **Pipeline invalid step** | Pipeline contains a step with unknown type | Rejected — `invalid_step` |
| **Mediation is active** | The mediation is currently in Active state | Rejected — `not_draft_or_deactivated` |
| **Mediation not found** | The mediation does not exist in storage | Rejected — `find_failed` |
| **Persistence fails** | The mediation cannot be saved to storage | Rejected — `save_failed` |

---

## 4. Pipeline

> The shell orchestrates input validation, data fetching, core domain logic, and persistence. Steps execute in sequence — the pipeline short-circuits on the first failure.

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (persistence or external service).

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `parseMediationId` | STEP | Validate the mediation ID format: must be a non-empty UUID string within length bounds. Checks for script injection. | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `parsePipeline` | STEP | Validate the pipeline structure: must be a non-empty array of steps, each with a known type (`filter`, `transform`, or `enrich`) and a `rules` field. | `not_an_array`, `empty`, `invalid_step` |
| 3 | `findMediation` | DEP | Load the existing mediation from storage by ID. | `find_failed` |
| 4 | `updatePipelineCore` | STEP | Core domain logic: verify the mediation is in Draft or Deactivated state and replace the pipeline. | `not_draft_or_deactivated` |
| 5 | `saveMediation` | DEP | Persist the updated mediation to storage. | `save_failed` |

---

## 5. Decision Table

> Decision tables show which conditions must hold (✓) or fail (✗) to produce each outcome. A dash (—) means the condition is not evaluated — the pipeline has already terminated at an earlier step.

> Column headers are abbreviated — see §4 for full step names and descriptions.

| Scenario | id str | id empty | id max | id uuid | id xss | pipe arr | pipe empty | pipe step | state | find | save | Outcome |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| ✅ pipeline updated | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Pipeline replaced on mediation |
| ❌ ID not a string | ✗ | — | — | — | — | — | — | — | — | — | — | Fails: `not_a_string` |
| ❌ ID empty | ✓ | ✗ | — | — | — | — | — | — | — | — | — | Fails: `empty` |
| ❌ ID too long | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | Fails: `too_long_max_64` |
| ❌ ID not a UUID | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | Fails: `not_a_uuid` |
| ❌ ID script injection | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | Fails: `script_injection` |
| ❌ pipeline not an array | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | Fails: `not_an_array` |
| ❌ pipeline empty | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | Fails: `empty` |
| ❌ pipeline invalid step | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | Fails: `invalid_step` |
| ❌ mediation is active | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | Fails: `not_draft_or_deactivated` |
| ❌ mediation not found | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | Fails: `find_failed` |
| ❌ save fails | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | Fails: `save_failed` |
