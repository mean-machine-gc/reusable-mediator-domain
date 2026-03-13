# deactivate-mediation

> Auto-generated from `deactivate-mediation.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `getMediationById` | `DEP` | Fetch mediation from persistence | -- |
| 2 | `generateTimestamp` | `DEP` | Generate deactivation timestamp | -- |
| 3 | `deactivateMediationCore` | `STEP` | Run deactivation core logic | -- |
| 4 | `upsertMediation` | `DEP` | Persist the deactivated mediation | -- |

---

## Decision Table

| Scenario | `deactivateMediationCore.checkDeactivatableState` :not_active | `(own)` :not_found | Outcome |
| --- | :---: | :---: | --- |
| OK mediation-deactivated | pass | pass | mediation-deactivated |
| FAIL not_active | FAIL | -- | Fails: `not_active` |
| FAIL not_found | pass | FAIL | Fails: `not_found` |
