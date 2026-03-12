# deactivate-mediation-shell

> Auto-generated from `deactivate-mediation-shell.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `parseMediationId` | `STEP` | Parse and validate the mediation ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `findMediation` | `DEP` | Fetch mediation from persistence | -- |
| 3 | `generateTimestamp` | `DEP` | Generate deactivation timestamp | -- |
| 4 | `deactivateMediationCore` | `STEP` | Run deactivation core logic | -- |
| 5 | `saveMediation` | `DEP` | Persist the deactivated mediation | -- |

---

## Decision Table

| Scenario | `parseMediationId` :not_a_string | `parseMediationId` :empty | `parseMediationId` :too_long_max_64 | `parseMediationId` :not_a_uuid | `parseMediationId` :script_injection | `deactivateMediationCore.checkDeactivatableState` :not_active | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| OK mediation-deactivated | pass | pass | pass | pass | pass | pass | mediation-deactivated |
| FAIL not_a_string | FAIL | -- | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | FAIL | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_64 | pass | pass | FAIL | -- | -- | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | pass | pass | pass | FAIL | -- | -- | Fails: `not_a_uuid` |
| FAIL script_injection | pass | pass | pass | pass | FAIL | -- | Fails: `script_injection` |
| FAIL not_active | pass | pass | pass | pass | pass | FAIL | Fails: `not_active` |
