# deactivate-mediation

> Auto-generated from `deactivate-mediation.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `checkDeactivatableState` | `STEP` | Verify mediation is in active state | `not_active` |
| 2 | `assembleDeactivatedMediation` | `STEP` | Assemble deactivated mediation | -- |
| 3 | `evaluateSuccessType` | `STEP` | Classify the success outcome | -- |

---

## Decision Table

| Scenario | `checkDeactivatableState` :not_active | Outcome |
| --- | :---: | --- |
| OK mediation-deactivated | pass | mediation-deactivated |
| FAIL not_active | FAIL | Fails: `not_active` |
