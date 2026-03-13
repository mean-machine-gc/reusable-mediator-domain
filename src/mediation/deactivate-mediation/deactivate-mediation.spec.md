# deactivate-mediation

> Auto-generated from `deactivate-mediation.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `safeGetMediationById` | `SAFE-DEP` | Fetch and validate mediation from persistence | `invalid_mediation` |
| 2 | `safeGenerateTimestamp` | `SAFE-DEP` | Generate and validate deactivation timestamp | `invalid_timestamp` |
| 3 | `deactivateMediationCore` | `STEP` | Run deactivation core logic | -- |
| 4 | `upsertMediation` | `DEP` | Persist the deactivated mediation | -- |

---

## Decision Table

| Scenario | `safeGetMediationById` :invalid_mediation | `safeGenerateTimestamp` :invalid_timestamp | `deactivateMediationCore.checkDeactivatableState` :not_active | `(own)` :not_found | Outcome |
| --- | :---: | :---: | :---: | :---: | --- |
| OK mediation-deactivated | pass | pass | pass | pass | mediation-deactivated |
| FAIL invalid_mediation | FAIL | -- | -- | -- | Fails: `invalid_mediation` |
| FAIL invalid_timestamp | pass | FAIL | -- | -- | Fails: `invalid_timestamp` |
| FAIL not_active | pass | pass | FAIL | -- | Fails: `not_active` |
| FAIL not_found | pass | pass | pass | FAIL | Fails: `not_found` |
