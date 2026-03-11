# create-mediation-shell

> **Operation Specification** · OpenHIM Reusable Mediator · v1.0

---

## 1. Overview

Creates a new mediation configuration in **Draft** state. A mediation connects a source topic (e.g. `orders.order-created.v1`) to a destination adapter endpoint (e.g. `https://openhim.example.org/adapter/dhis2/patient`) and defines the pipeline of operations (filter, transform, enrich) to apply to events before routing them.

| Outcome | When | Result |
|---|---|---|
| ✅ **mediation-created** | All inputs are valid | A new `DraftMediation` is persisted and returned |

> The operation is protected by input validation on topic format, destination URL, and pipeline structure. Script injection is checked on string inputs. No state is changed in any failure case.

---

## 2. Operation Interface

| | |
|---|---|
| **Name** | `createMediation` |
| **Input** | `topic`, `destination`, `pipeline` |
| **Output** | `DraftMediation` |
| **Description** | Validates raw input, generates a unique ID and creation timestamp, assembles a Draft mediation, and persists it. The mediation starts in Draft — it must be explicitly activated before it processes events. |

---

## 3. Business Scenarios

### 3.1 Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Mediation created** | Admin submits topic `orders.order-created.v1`, destination `https://openhim.example.org/adapter/dhis2/patient`, and a pipeline with one filter step checking event type equals `patient-created`. | A new Draft mediation is created with a generated UUID and timestamp. It is persisted and returned. |

### 3.2 Failure Cases

No state is modified in any of the following cases.

| Scenario | Given | Outcome |
|---|---|---|
| **Invalid topic type** | Topic is a number instead of a string | Rejected — `not_a_string` |
| **Empty topic** | Topic is an empty string | Rejected — `empty` |
| **Topic too short** | Topic is `"a"` (less than 2 characters) | Rejected — `too_short_min_2` |
| **Topic too long** | Topic exceeds 256 characters | Rejected — `too_long_max_256` |
| **Topic bad format** | Topic starts with a dot (e.g. `.orders`) | Rejected — `invalid_format_dot_separated_segments` |
| **Topic invalid chars** | Topic contains slashes (e.g. `orders/created`) | Rejected — `invalid_chars_alphanumeric_hyphens_and_dots_only` |
| **Topic script injection** | Topic contains `<script>` tags | Rejected — `script_injection` |
| **Destination too long** | Destination URL exceeds 2048 characters | Rejected — `too_long_max_2048` |
| **Destination not a URL** | Destination is a plain string, not an HTTP(S) URL | Rejected — `invalid_format_url` |
| **Pipeline not an array** | Pipeline is a string or object instead of an array | Rejected — `not_an_array` |
| **Pipeline invalid step** | Pipeline contains a step with unknown type | Rejected — `invalid_step` |
| **ID generation fails** | Infrastructure cannot generate a UUID | Rejected — `generate_id_failed` |
| **Timestamp generation fails** | Infrastructure cannot produce a timestamp | Rejected — `generate_timestamp_failed` |
| **Persistence fails** | The mediation cannot be saved to storage | Rejected — `save_failed` |

---

## 4. Pipeline

The shell orchestrates input validation, context generation, domain assembly, and persistence. Steps execute in sequence — the pipeline short-circuits on the first failure.

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (persistence or external service).

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `parseTopic` | STEP | Validate the topic format: must be a dot-separated string of alphanumeric and hyphen segments (e.g. `orders.order-created.v1`). Checks length bounds, format, allowed characters, and script injection. | `not_a_string`, `empty`, `too_short_min_2`, `too_long_max_256`, `invalid_format_dot_separated_segments`, `invalid_chars_alphanumeric_hyphens_and_dots_only`, `script_injection` |
| 2 | `parseDestination` | STEP | Validate the destination URL: must be a valid HTTP or HTTPS URL within length bounds. Checks for script injection. | `not_a_string`, `empty`, `too_long_max_2048`, `invalid_format_url`, `script_injection` |
| 3 | `parsePipeline` | STEP | Validate the pipeline structure: must be a non-empty array of steps, each with a known type (`filter`, `transform`, or `enrich`) and a `rules` field. | `not_an_array`, `empty`, `invalid_step` |
| 4 | `assembleDraftMediation` | STEP | Construct a `DraftMediation` object from the parsed topic, destination, pipeline, generated ID, and timestamp. Pure assembly — no validation, no failures. | — |
| 5 | `generateId` | DEP | Produce a new UUID to serve as the mediation identifier. | `generate_id_failed` |
| 6 | `generateTimestamp` | DEP | Produce the current timestamp for the `createdAt` field. | `generate_timestamp_failed` |
| 7 | `saveMediation` | DEP | Persist the newly assembled Draft mediation to storage. | `save_failed` |

---

## 5. Decision Table

The decision table shows which conditions must hold (✓) or fail (✗) to produce each outcome. A dash (—) means the condition is not evaluated — the pipeline has already terminated at an earlier step.

> Column headers are abbreviated — see §4 for full step names and descriptions.

| Scenario | topic str | topic empty | topic min | topic max | topic fmt | topic chars | topic xss | dest str | dest empty | dest max | dest url | dest xss | pipe arr | pipe empty | pipe step | gen id | gen ts | save | Outcome |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| ✅ mediation-created | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Draft mediation created |
| ❌ topic not a string | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | Fails: `not_a_string` |
| ❌ topic empty | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | Fails: `empty` |
| ❌ topic too short | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | Fails: `too_short_min_2` |
| ❌ topic too long | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | — | — | Fails: `too_long_max_256` |
| ❌ topic bad format | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | — | Fails: `invalid_format_dot_separated_segments` |
| ❌ topic invalid chars | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | — | — | Fails: `invalid_chars_...` |
| ❌ topic script injection | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | — | Fails: `script_injection` |
| ❌ dest not a string | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | — | Fails: `not_a_string` |
| ❌ dest empty | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | — | Fails: `empty` |
| ❌ dest too long | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | — | Fails: `too_long_max_2048` |
| ❌ dest not a URL | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | — | Fails: `invalid_format_url` |
| ❌ dest script injection | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | — | Fails: `script_injection` |
| ❌ pipeline not array | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | Fails: `not_an_array` |
| ❌ pipeline empty | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | Fails: `empty` |
| ❌ pipeline invalid step | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | Fails: `invalid_step` |
| ❌ ID generation fails | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | Fails: `generate_id_failed` |
| ❌ timestamp fails | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | Fails: `generate_timestamp_failed` |
| ❌ save fails | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | Fails: `save_failed` |
