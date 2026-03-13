# validate-processing

> Auto-generated from `validate-processing.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `getIncomingProcessingById` | `DEP` | Load aggregate state from persistence | -- |
| 2 | `resolveSchema` | `DEP` | Resolve JSON Schema from registry using dataschemaUri | -- |
| 3 | `generateTimestamp` | `DEP` | Generate validated timestamp from clock | -- |
| 4 | `validateProcessingCore` | `STEP` | Validate event data against schema and transition to validated | `not_in_received_state`, `schema_validation_failed` |
| 5 | `upsertIncomingProcessing` | `DEP` | Persist the updated aggregate | -- |

---

## Decision Table

| Scenario | `validateProcessingCore` :not_in_received_state | `validateProcessingCore` :schema_validation_failed | `(own)` :not_found | `(own)` :schema_not_found | Outcome |
| --- | :---: | :---: | :---: | :---: | --- |
| OK processing-validated | pass | pass | pass | pass | processing-validated |
| FAIL not_in_received_state | FAIL | -- | -- | -- | Fails: `not_in_received_state` |
| FAIL schema_validation_failed | pass | FAIL | -- | -- | Fails: `schema_validation_failed` |
| FAIL not_found | pass | pass | FAIL | -- | Fails: `not_found` |
| FAIL schema_not_found | pass | pass | pass | FAIL | Fails: `schema_not_found` |
