# activate-mediation

> Auto-generated from `activate-mediation.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `safeGetMediationById` | `SAFE-DEP` | Fetch and validate mediation from persistence | `invalid_mediation` |
| 2 | `safeGenerateTimestamp` | `SAFE-DEP` | Generate and validate activation timestamp | `invalid_timestamp` |
| 3 | `activateMediationCore` | `STEP` | Run activation core logic | -- |
| 4 | `upsertMediation` | `DEP` | Persist the activated mediation | -- |

---

## Decision Table

| Scenario | `safeGetMediationById` :invalid_mediation | `safeGenerateTimestamp` :invalid_timestamp | `activateMediationCore.checkActivatableState` :already_active | `(own)` :not_found | Outcome |
| --- | :---: | :---: | :---: | :---: | --- |
| OK draft-activated | pass | pass | pass | pass | draft-activated |
| OK reactivated | pass | pass | pass | pass | reactivated |
| FAIL invalid_mediation | FAIL | -- | -- | -- | Fails: `invalid_mediation` |
| FAIL invalid_timestamp | pass | FAIL | -- | -- | Fails: `invalid_timestamp` |
| FAIL already_active | pass | pass | FAIL | -- | Fails: `already_active` |
| FAIL not_found | pass | pass | pass | FAIL | Fails: `not_found` |
