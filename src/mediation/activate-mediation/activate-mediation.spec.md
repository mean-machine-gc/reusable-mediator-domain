# activate-mediation

> Auto-generated from `activate-mediation.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `getMediationById` | `DEP` | Fetch mediation from persistence | -- |
| 2 | `generateTimestamp` | `DEP` | Generate activation timestamp | -- |
| 3 | `activateMediationCore` | `STEP` | Run activation core logic | -- |
| 4 | `upsertMediation` | `DEP` | Persist the activated mediation | -- |

---

## Decision Table

| Scenario | `activateMediationCore.checkActivatableState` :already_active | `(own)` :not_found | Outcome |
| --- | :---: | :---: | --- |
| OK draft-activated | pass | pass | draft-activated |
| OK reactivated | pass | pass | reactivated |
| FAIL already_active | FAIL | -- | Fails: `already_active` |
| FAIL not_found | pass | FAIL | Fails: `not_found` |
