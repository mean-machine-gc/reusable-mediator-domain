# poll-dispatches

> Auto-generated from `poll-dispatches.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `findDispatchesByState` | `DEP` | Fetch up to batchSize dispatches in to-deliver or attempted state | -- |
| 2 | `recordDelivery` | `STEP` | Call recordDelivery shell — attempts delivery and records outcome | `not_found` |
| 3 | `classifyDeliveryResults` | `STEP` | Classify delivery outcomes into delivered, retrying, exhausted | -- |

---

## Decision Table

| Scenario | `recordDelivery.recordDeliveryCore` :already_terminal | Outcome |
| --- | :---: | --- |
| OK empty-batch | pass | empty-batch |
| OK batch-processed | pass | batch-processed |
| FAIL already_terminal | FAIL | Fails: `already_terminal` |
