# fail-processing-shell

> Auto-generated from `fail-processing-shell.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `parseProcessingId` | `STEP` | Parse and validate the processing ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `parseProcessingFailureReason` | `STEP` | Parse and validate the failure reason | `not_a_string`, `empty`, `too_long_max_4096` |
| 3 | `loadState` | `DEP` | Load aggregate state from persistence | -- |
| 4 | `generateFailedAt` | `DEP` | Generate failed timestamp from clock | -- |
| 5 | `failProcessingCore` | `STEP` | Validate state gate and transition to failed | `already_terminal` |
| 6 | `save` | `DEP` | Persist the updated aggregate | -- |

---

## Decision Table

| Scenario | `parseProcessingId` :not_a_string | `parseProcessingId` :empty | `parseProcessingId` :too_long_max_64 | `parseProcessingId` :not_a_uuid | `parseProcessingId` :script_injection | `parseProcessingFailureReason` :not_a_string | `parseProcessingFailureReason` :empty | `parseProcessingFailureReason` :too_long_max_4096 | `failProcessingCore` :already_terminal | `(own)` :not_found | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| OK processing-failed | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | processing-failed |
| FAIL not_a_string | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_64 | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | Fails: `not_a_uuid` |
| FAIL script_injection | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | Fails: `script_injection` |
| FAIL not_a_string | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_4096 | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | Fails: `too_long_max_4096` |
| FAIL already_terminal | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | Fails: `already_terminal` |
| FAIL not_found | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | Fails: `not_found` |
