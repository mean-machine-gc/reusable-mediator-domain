# poll-validated

> Auto-generated from `poll-validated.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `findIncomingProcessingsByState` | `DEP` | Fetch up to batchSize processing records in validated state | -- |
| 2 | `findActiveMediationsByTopic` | `DEP` | Find all active mediations matching a topic | -- |
| 3 | `getTransformRegistry` | `DEP` | Retrieve the transform function registry | -- |
| 4 | `mediateAll` | `STEP` | Run all mediations for an event, collect outcomes | `unknown_transform` |
| 5 | `safeGenerateId` | `SAFE-DEP` | Generate and validate a unique dispatch ID | `invalid_id` |
| 6 | `createDispatch` | `STEP` | Create a dispatch aggregate for a routed mediation result | `already_exists` |
| 7 | `mediateProcessing` | `STEP` | Transition processing record to mediated with outcomes | `not_found` |
| 8 | `failProcessing` | `STEP` | Transition a record to failed state on error | `not_found` |

---

## Decision Table

| Scenario | `mediateAll.mediateCore.executeTransforms` :unknown_transform | `safeGenerateId` :invalid_id | `createDispatch.safeGetDispatchById` :invalid_dispatch | `createDispatch.safeGenerateTimestamp` :invalid_timestamp | `createDispatch.createDispatchCore` :already_exists | `mediateProcessing.safeGetIncomingProcessingById` :invalid_incoming_processing | `mediateProcessing.safeGenerateTimestamp` :invalid_timestamp | `mediateProcessing.mediateProcessingCore` :not_in_validated_state | `failProcessing.safeGetIncomingProcessingById` :invalid_incoming_processing | `failProcessing.safeGenerateTimestamp` :invalid_timestamp | `failProcessing.failProcessingCore` :already_terminal | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| OK empty-batch | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | empty-batch |
| OK batch-processed | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | batch-processed |
| FAIL unknown_transform | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `unknown_transform` |
| FAIL invalid_id | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `invalid_id` |
| FAIL invalid_dispatch | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | -- | Fails: `invalid_dispatch` |
| FAIL invalid_timestamp | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | -- | Fails: `invalid_timestamp` |
| FAIL already_exists | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | -- | Fails: `already_exists` |
| FAIL invalid_incoming_processing | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | -- | Fails: `invalid_incoming_processing` |
| FAIL invalid_timestamp | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | -- | Fails: `invalid_timestamp` |
| FAIL not_in_validated_state | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | -- | Fails: `not_in_validated_state` |
| FAIL invalid_incoming_processing | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | -- | Fails: `invalid_incoming_processing` |
| FAIL invalid_timestamp | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | -- | Fails: `invalid_timestamp` |
| FAIL already_terminal | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | FAIL | Fails: `already_terminal` |
