# mediate-processing-shell

> Auto-generated from `mediate-processing-shell.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `parseProcessingId` | `STEP` | Parse and validate the processing ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `loadState` | `DEP` | Load aggregate state from persistence | -- |
| 3 | `generateMediatedAt` | `DEP` | Generate mediated timestamp from clock | -- |
| 4 | `mediateProcessingCore` | `STEP` | Attach outcomes and transition to mediated | `not_in_validated_state` |
| 5 | `save` | `DEP` | Persist the updated aggregate | -- |

---

## Decision Table

| Scenario | `parseProcessingId` :not_a_string | `parseProcessingId` :empty | `parseProcessingId` :too_long_max_64 | `parseProcessingId` :not_a_uuid | `parseProcessingId` :script_injection | `mediateProcessingCore` :not_in_validated_state | `(own)` :not_found | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| OK processing-mediated | pass | pass | pass | pass | pass | pass | pass | processing-mediated |
| FAIL not_a_string | FAIL | -- | -- | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | FAIL | -- | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_64 | pass | pass | FAIL | -- | -- | -- | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | pass | pass | pass | FAIL | -- | -- | -- | Fails: `not_a_uuid` |
| FAIL script_injection | pass | pass | pass | pass | FAIL | -- | -- | Fails: `script_injection` |
| FAIL not_in_validated_state | pass | pass | pass | pass | pass | FAIL | -- | Fails: `not_in_validated_state` |
| FAIL not_found | pass | pass | pass | pass | pass | pass | FAIL | Fails: `not_found` |
