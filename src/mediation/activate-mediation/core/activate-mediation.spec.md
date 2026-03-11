# activate-mediation-core

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
| 1 | `checkActivatableState` | `STEP` | `not_draft_or_deactivated` |
| 2 | `assembleActiveMediation` | `STEP` | — |
<!-- END:GENERATED:PIPELINE -->

---

## 5. Decision Tables

<!-- BEGIN:GENERATED:DECISION -->
| Scenario | `checkActivatableState` :not_draft_or_deactivated | Outcome |
| --- | :---: | --- |
| ✅ draft-activated | ✓ | draft-activated |
| ✅ reactivated | ✓ | reactivated |
| ❌ not_draft_or_deactivated | ✗ | Fails: `not_draft_or_deactivated` |
<!-- END:GENERATED:DECISION -->
