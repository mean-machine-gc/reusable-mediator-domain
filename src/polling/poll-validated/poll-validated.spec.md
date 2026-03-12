# poll-validated

> Auto-generated from `poll-validated.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `fetchValidated` | `DEP` | Fetch up to batchSize processing records in validated state | -- |
| 2 | `findActiveMediationsByTopic` | `DEP` | Find all active mediations matching a topic | -- |
| 3 | `getTransformRegistry` | `DEP` | Retrieve the transform function registry | -- |
| 4 | `mediateAll` | `STEP` | Run all mediations for an event, collect outcomes | `unknown_transform` |
| 5 | `generateDispatchId` | `DEP` | Generate a unique dispatch ID for each routed result | -- |
| 6 | `createDispatch` | `DEP` | Create a dispatch aggregate for a routed mediation result | -- |
| 7 | `mediateProcessing` | `DEP` | Transition processing record to mediated with outcomes | -- |
| 8 | `failProcessing` | `DEP` | Transition a record to failed state on error | -- |

---

## Decision Table

| Scenario | `mediateAll.mediateCore.executeTransforms` :unknown_transform | Outcome |
| --- | :---: | --- |
| OK empty-batch | pass | empty-batch |
| OK batch-processed | pass | batch-processed |
| FAIL unknown_transform | FAIL | Fails: `unknown_transform` |
