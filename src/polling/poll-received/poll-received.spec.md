# poll-received

> Auto-generated from `poll-received.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `fetchReceived` | `DEP` | Fetch up to batchSize processing records in received state | -- |
| 2 | `validateProcessing` | `DEP` | Call validateProcessing shell for a single record | -- |
| 3 | `failProcessing` | `DEP` | Transition a record to failed state on validation failure | -- |
| 4 | `classifyValidationResults` | `STEP` | Split results into validated and failed arrays | -- |

---

## Decision Table

| Scenario | Outcome |
| --- | --- |
| OK empty-batch | empty-batch |
| OK batch-processed | batch-processed |
