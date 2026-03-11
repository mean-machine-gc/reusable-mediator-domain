# update-pipeline-core

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
| 1 | `checkUpdatableState` | `STEP` | `not_draft_or_deactivated` |
| 2 | `applyPipeline` | `STEP` | — |
<!-- END:GENERATED:PIPELINE -->

---

## 5. Decision Tables

<!-- BEGIN:GENERATED:DECISION -->
| Scenario | `checkUpdatableState` :not_draft_or_deactivated | Outcome |
| --- | :---: | --- |
| ✅ pipeline-updated | ✓ | pipeline-updated |
| ❌ not_draft_or_deactivated | ✗ | Fails: `not_draft_or_deactivated` |
<!-- END:GENERATED:DECISION -->
