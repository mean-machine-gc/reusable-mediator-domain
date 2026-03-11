# deactivate-mediation-core

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
| 1 | `checkDeactivatableState` | `STEP` | `not_active` |
| 2 | `assembleDeactivatedMediation` | `STEP` | — |
<!-- END:GENERATED:PIPELINE -->

---

## 5. Decision Tables

<!-- BEGIN:GENERATED:DECISION -->
| Scenario | `checkDeactivatableState` :not_active | Outcome |
| --- | :---: | --- |
| ✅ mediation-deactivated | ✓ | mediation-deactivated |
| ❌ not_active | ✗ | Fails: `not_active` |
<!-- END:GENERATED:DECISION -->
