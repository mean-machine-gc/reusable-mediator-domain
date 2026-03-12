# validate-processing-shell

> Auto-generated from `validate-processing-shell.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `parseProcessingId` | `STEP` | Parse and validate the processing ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `loadState` | `DEP` | Load aggregate state from persistence | -- |
| 3 | `resolveSchema` | `DEP` | Resolve JSON Schema from registry using dataschemaUri | -- |
| 4 | `generateValidatedAt` | `DEP` | Generate validated timestamp from clock | -- |
| 5 | `validateProcessingCore` | `STEP` | Validate event data against schema and transition to validated | `not_in_received_state`, `schema_validation_failed` |
| 6 | `save` | `DEP` | Persist the updated aggregate | -- |

---

## Decision Table

| Scenario | `parseProcessingId` :not_a_string | `parseProcessingId` :empty | `parseProcessingId` :too_long_max_64 | `parseProcessingId` :not_a_uuid | `parseProcessingId` :script_injection | `validateProcessingCore` :not_in_received_state | `validateProcessingCore` :schema_validation_failed | `(own)` :not_found | `(own)` :schema_not_found | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| OK processing-validated | pass | pass | pass | pass | pass | pass | pass | pass | pass | processing-validated |
| FAIL not_a_string | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_64 | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | Fails: `not_a_uuid` |
| FAIL script_injection | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | Fails: `script_injection` |
| FAIL not_in_received_state | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | Fails: `not_in_received_state` |
| FAIL schema_validation_failed | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | Fails: `schema_validation_failed` |
| FAIL not_found | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | Fails: `not_found` |
| FAIL schema_not_found | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | Fails: `schema_not_found` |
