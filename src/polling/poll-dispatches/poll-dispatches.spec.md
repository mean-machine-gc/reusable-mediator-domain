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

| Scenario | `recordDelivery.safeGetDispatchById` :invalid_dispatch | `recordDelivery.safeDeliver` :invalid_delivery_attempt | `recordDelivery.recordDeliveryCore` :already_terminal | Outcome |
| --- | :---: | :---: | :---: | --- |
| OK empty-batch | pass | pass | pass | empty-batch |
| OK batch-processed | pass | pass | pass | batch-processed |
| FAIL invalid_dispatch | FAIL | -- | -- | Fails: `invalid_dispatch` |
| FAIL invalid_delivery_attempt | pass | FAIL | -- | Fails: `invalid_delivery_attempt` |
| FAIL already_terminal | pass | pass | FAIL | Fails: `already_terminal` |
