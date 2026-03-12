# poll-dispatches

> Auto-generated from `poll-dispatches.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `fetchDispatches` | `DEP` | Fetch up to batchSize dispatches in to-deliver or attempted state | -- |
| 2 | `recordDelivery` | `DEP` | Call recordDelivery shell — attempts delivery and records outcome | -- |
| 3 | `classifyDeliveryResults` | `STEP` | Classify delivery outcomes into delivered, retrying, exhausted | -- |

---

## Decision Table

| Scenario | Outcome |
| --- | --- |
| OK empty-batch | empty-batch |
| OK batch-processed | batch-processed |
