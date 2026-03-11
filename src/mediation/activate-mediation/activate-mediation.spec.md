# activate-mediation-shell

> **Operation Specification**

---

## 1. Overview

<!-- TODO: run ddd-documentation to fill this section -->

---

## 2. Operation Interface

<!-- TODO: run ddd-documentation to fill this section -->

---

## 3. Business Scenarios

<!-- TODO: run ddd-documentation to fill this section -->

---

## 4. Pipeline

<!-- BEGIN:GENERATED:PIPELINE -->
| # | Name | Type | Failure Codes |
| --- | --- | --- | --- |
| 1 | `parseMediationId` | `STEP` | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `activateMediationCore` | `STEP` | `not_draft_or_deactivated` |
| 3 | `findMediation` | `DEP` | `find_failed` |
| 4 | `generateTimestamp` | `DEP` | `generate_timestamp_failed` |
| 5 | `saveMediation` | `DEP` | `save_failed` |
<!-- END:GENERATED:PIPELINE -->

---

## 5. Decision Tables

<!-- BEGIN:GENERATED:DECISION -->
| Scenario | `parseMediationId` :not_a_string | `parseMediationId` :empty | `parseMediationId` :too_long_max_64 | `parseMediationId` :not_a_uuid | `parseMediationId` :script_injection | `checkActivatableState` :not_draft_or_deactivated | `findMediation` :find_failed | `generateTimestamp` :generate_timestamp_failed | `saveMediation` :save_failed | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| ✅ draft-activated | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | draft-activated |
| ✅ reactivated | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | reactivated |
| ❌ not_a_string | ✗ | — | — | — | — | — | — | — | — | Fails: `not_a_string` |
| ❌ empty | ✓ | ✗ | — | — | — | — | — | — | — | Fails: `empty` |
| ❌ too_long_max_64 | ✓ | ✓ | ✗ | — | — | — | — | — | — | Fails: `too_long_max_64` |
| ❌ not_a_uuid | ✓ | ✓ | ✓ | ✗ | — | — | — | — | — | Fails: `not_a_uuid` |
| ❌ script_injection | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | — | Fails: `script_injection` |
| ❌ not_draft_or_deactivated | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | — | Fails: `not_draft_or_deactivated` |
| ❌ find_failed | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | — | Fails: `find_failed` |
| ❌ generate_timestamp_failed | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | — | Fails: `generate_timestamp_failed` |
| ❌ save_failed | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | Fails: `save_failed` |
<!-- END:GENERATED:DECISION -->
