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

> The operation is protected by input validation. No state is changed in any failure case.

---

## Interface

| | |
|---|---|
| **Name** | `createMediation` |
| **Input** | `topic` (raw), `destination` (raw), `pipeline` (raw) |
| **Output** | `DraftMediation` |
| **Sync/Async** | Async (shell factory) |

---

## Business Scenarios

### Happy Paths

| Scenario | Given | Then |
|---|---|---|
| **Create with filter pipeline** | Topic `patient.created`, destination `https://example.com/webhook`, pipeline with one filter step checking `data.type equals patient` | Draft mediation created with generated UUID and timestamp |
| **Create with transform pipeline** | Topic `org.facility-registry.update`, destination `http://localhost:3000/callback`, pipeline with an `uppercase` transform | Draft mediation created |
| **Create with mixed pipeline** | Topic and destination provided, pipeline with both filter and transform steps | Draft mediation created with all steps preserved |

### Failure Cases

No state is modified in any of the following cases.

| Failure | When | Source |
|---|---|---|
| `not_a_string` | Topic is not a string (e.g. a number, null) | `parseTopic` step |
| `empty` | Topic is an empty string | `parseTopic` step |
| `too_short_min_2` | Topic is shorter than 2 characters | `parseTopic` step |
| `too_long_max_256` | Topic exceeds 256 characters | `parseTopic` step |
| `invalid_format_dot_separated_segments` | Topic has leading/trailing/consecutive dots | `parseTopic` step |
| `invalid_chars_alphanumeric_hyphens_and_dots_only` | Topic contains spaces, underscores, or special characters | `parseTopic` step |
| `script_injection` | Topic contains `<script>` tags or similar injection patterns | `parseTopic` step |
| `not_a_string` | Destination is not a string | `parseDestination` step |
| `empty` | Destination is an empty string | `parseDestination` step |
| `too_long_max_2048` | Destination exceeds 2048 characters | `parseDestination` step |
| `invalid_format_url` | Destination is not a valid HTTP/HTTPS URL | `parseDestination` step |
| `script_injection` | Destination contains injection patterns | `parseDestination` step |
| `not_an_array` | Pipeline is not an array | `parsePipeline` step |
| `empty` | Pipeline is an empty array | `parsePipeline` step |
| `invalid_step` | Pipeline contains a step with missing or invalid type | `parsePipeline` step |

### Assertions

When a mediation is created:
- The output is a valid `DraftMediation` with status `draft`
- The topic, destination, and pipeline match the input values
- A unique ID and creation timestamp are assigned

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
|---|---|---|---|---|
| 1 | `parseTopic` | `STEP` | Parse and validate the topic | `not_a_string`, `empty`, `too_short_min_2`, `too_long_max_256`, `invalid_format_dot_separated_segments`, `invalid_chars_alphanumeric_hyphens_and_dots_only`, `script_injection` |
| 2 | `parseDestination` | `STEP` | Parse and validate the destination | `not_a_string`, `empty`, `too_long_max_2048`, `invalid_format_url`, `script_injection` |
| 3 | `parsePipeline` | `STEP` | Parse and validate the pipeline | `not_an_array`, `empty`, `invalid_step` |
| 4 | `generateId` | `DEP` | Generate a unique mediation ID | -- |
| 5 | `generateTimestamp` | `DEP` | Generate creation timestamp | -- |
| 6 | `assembleDraftMediation` | `STEP` | Assemble the draft mediation | -- |
| 7 | `saveMediation` | `DEP` | Persist the new mediation | -- |

> **STEP** — pure, synchronous domain function. No I/O, fully testable in isolation.
> **DEP** — async infrastructure dependency (persistence or external service).

---

## Decision Table

Column headers abbreviated — see Pipeline for full step names.

| Scenario | topic :str | topic :empty | topic :short | topic :long | topic :fmt | topic :chars | topic :xss | dest :str | dest :empty | dest :long | dest :url | dest :xss | pipe :arr | pipe :empty | pipe :step | Outcome |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| OK mediation-created | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | mediation-created |
| FAIL not_a_string | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_short_min_2 | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `too_short_min_2` |
| FAIL too_long_max_256 | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `too_long_max_256` |
| FAIL invalid_format | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `invalid_format_dot_separated_segments` |
| FAIL invalid_chars | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `invalid_chars_...` |
| FAIL script_injection | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `script_injection` |
| FAIL not_a_string | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_2048 | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | Fails: `too_long_max_2048` |
| FAIL invalid_format_url | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | Fails: `invalid_format_url` |
| FAIL script_injection | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | Fails: `script_injection` |
| FAIL not_an_array | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | Fails: `not_an_array` |
| FAIL empty | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | Fails: `empty` |
| FAIL invalid_step | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | Fails: `invalid_step` |
