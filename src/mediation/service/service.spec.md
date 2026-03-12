# handle-event-service

> Auto-generated from `handle-event-service.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `extractEventType` | `STEP` | Read event.type as the topic and validate dataschema presence | `missing_dataschema` |
| 2 | `resolveSchema` | `DEP` | Fetch JSON Schema from registry using event.dataschema URI | -- |
| 3 | `validateEventData` | `STEP` | Validate event.data against the resolved schema | `schema_validation_failed` |
| 4 | `findActiveMediationsByTopic` | `DEP` | Fetch all active mediations whose topic matches the event type | -- |
| 5 | `getTransformRegistry` | `DEP` | Retrieve the transform function registry | -- |
| 6 | `mediateAll` | `STEP` | Run mediateCore for each mediation and collect results | `unknown_transform` |
| 7 | `evaluateMediateOutcome` | `STEP` | Short-circuit if no dispatches, continue if dispatches exist | -- |
| 8 | `dispatchAll` | `DEP` | Send each processed event to its destination | -- |
| 9 | `evaluateSuccessType` | `STEP` | Assemble final result after successful dispatch | -- |

---

## Decision Table

| Scenario | `extractEventType` :missing_dataschema | `validateEventData` :schema_validation_failed | `mediateAll` :unknown_transform | `(own)` :schema_not_found | `(own)` :dispatch_failed | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | --- |
| OK events-dispatched | pass | pass | pass | pass | pass | events-dispatched |
| OK all-skipped | pass | pass | pass | pass | pass | all-skipped |
| OK no-mediations | pass | pass | pass | pass | pass | no-mediations |
| FAIL missing_dataschema | FAIL | -- | -- | -- | -- | Fails: `missing_dataschema` |
| FAIL schema_validation_failed | pass | FAIL | -- | -- | -- | Fails: `schema_validation_failed` |
| FAIL unknown_transform | pass | pass | FAIL | -- | -- | Fails: `unknown_transform` |
| FAIL schema_not_found | pass | pass | pass | FAIL | -- | Fails: `schema_not_found` |
| FAIL dispatch_failed | pass | pass | pass | pass | FAIL | Fails: `dispatch_failed` |
