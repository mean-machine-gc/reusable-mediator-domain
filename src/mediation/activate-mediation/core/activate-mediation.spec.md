# activate-mediation-core

> Auto-generated from `activate-mediation-core.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `checkActivatableState` | `STEP` | Verify mediation is in draft or deactivated state | `already_active` |
| 2 | `assembleActiveMediation` | `STEP` | Assemble active mediation from state and context | -- |
| 3 | `evaluateSuccessType` | `STEP` | Classify the success outcome | -- |

---

## Decision Table

| Scenario | `checkActivatableState` :already_active | Outcome |
| --- | :---: | --- |
| OK draft-activated | pass | draft-activated |
| OK reactivated | pass | reactivated |
| FAIL already_active | FAIL | Fails: `already_active` |
