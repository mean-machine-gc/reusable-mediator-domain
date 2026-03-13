# poll-received

> Auto-generated from `poll-received.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `findIncomingProcessingsByState` | `DEP` | Fetch up to batchSize processing records in received state | -- |
| 2 | `validateProcessing` | `STEP` | Call validateProcessing shell for a single record | `not_found`, `schema_not_found` |
| 3 | `failProcessing` | `STEP` | Transition a record to failed state on validation failure | `not_found` |
| 4 | `classifyValidationResults` | `STEP` | Split results into validated and failed arrays | -- |

---

## Decision Table

| Scenario | `validateProcessing.safeGetIncomingProcessingById` :invalid_incoming_processing | `validateProcessing.safeResolveSchema` :invalid_schema | `validateProcessing.safeGenerateTimestamp` :invalid_timestamp | `validateProcessing.validateProcessingCore` :not_in_received_state | `validateProcessing.validateProcessingCore` :schema_validation_failed | `failProcessing.safeGetIncomingProcessingById` :invalid_incoming_processing | `failProcessing.safeGenerateTimestamp` :invalid_timestamp | `failProcessing.failProcessingCore` :already_terminal | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| OK empty-batch | pass | pass | pass | pass | pass | pass | pass | pass | empty-batch |
| OK batch-processed | pass | pass | pass | pass | pass | pass | pass | pass | batch-processed |
| FAIL invalid_incoming_processing | FAIL | -- | -- | -- | -- | -- | -- | -- | Fails: `invalid_incoming_processing` |
| FAIL invalid_schema | pass | FAIL | -- | -- | -- | -- | -- | -- | Fails: `invalid_schema` |
| FAIL invalid_timestamp | pass | pass | FAIL | -- | -- | -- | -- | -- | Fails: `invalid_timestamp` |
| FAIL not_in_received_state | pass | pass | pass | FAIL | -- | -- | -- | -- | Fails: `not_in_received_state` |
| FAIL schema_validation_failed | pass | pass | pass | pass | FAIL | -- | -- | -- | Fails: `schema_validation_failed` |
| FAIL invalid_incoming_processing | pass | pass | pass | pass | pass | FAIL | -- | -- | Fails: `invalid_incoming_processing` |
| FAIL invalid_timestamp | pass | pass | pass | pass | pass | pass | FAIL | -- | Fails: `invalid_timestamp` |
| FAIL already_terminal | pass | pass | pass | pass | pass | pass | pass | FAIL | Fails: `already_terminal` |
