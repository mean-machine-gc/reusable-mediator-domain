# validate-processing

> Auto-generated from `validate-processing.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `safeGetIncomingProcessingById` | `SAFE-DEP` | Fetch and validate incoming processing from persistence | `invalid_incoming_processing` |
| 2 | `safeResolveSchema` | `SAFE-DEP` | Resolve and validate JSON Schema from registry | `invalid_schema` |
| 3 | `safeGenerateTimestamp` | `SAFE-DEP` | Generate and validate validated timestamp | `invalid_timestamp` |
| 4 | `validateProcessingCore` | `STEP` | Validate event data against schema and transition to validated | `not_in_received_state`, `schema_validation_failed` |
| 5 | `upsertIncomingProcessing` | `DEP` | Persist the updated aggregate | -- |

---

## Decision Table

| Scenario | `safeGetIncomingProcessingById` :invalid_incoming_processing | `safeResolveSchema` :invalid_schema | `safeGenerateTimestamp` :invalid_timestamp | `validateProcessingCore` :not_in_received_state | `validateProcessingCore` :schema_validation_failed | `(own)` :not_found | `(own)` :schema_not_found | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| OK processing-validated | pass | pass | pass | pass | pass | pass | pass | processing-validated |
| FAIL invalid_incoming_processing | FAIL | -- | -- | -- | -- | -- | -- | Fails: `invalid_incoming_processing` |
| FAIL invalid_schema | pass | FAIL | -- | -- | -- | -- | -- | Fails: `invalid_schema` |
| FAIL invalid_timestamp | pass | pass | FAIL | -- | -- | -- | -- | Fails: `invalid_timestamp` |
| FAIL not_in_received_state | pass | pass | pass | FAIL | -- | -- | -- | Fails: `not_in_received_state` |
| FAIL schema_validation_failed | pass | pass | pass | pass | FAIL | -- | -- | Fails: `schema_validation_failed` |
| FAIL not_found | pass | pass | pass | pass | pass | FAIL | -- | Fails: `not_found` |
| FAIL schema_not_found | pass | pass | pass | pass | pass | pass | FAIL | Fails: `schema_not_found` |
