# record-delivery

> Auto-generated from `record-delivery.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `safeGetDispatchById` | `SAFE-DEP` | Fetch and validate dispatch from persistence | `invalid_dispatch` |
| 2 | `safeDeliver` | `SAFE-DEP` | Attempt HTTP delivery and validate DeliveryAttempt result | `invalid_delivery_attempt` |
| 3 | `getMaxAttempts` | `DEP` | Retrieve the max attempts configuration | -- |
| 4 | `recordDeliveryCore` | `STEP` | Evaluate attempt result, transition state accordingly | `already_terminal` |
| 5 | `upsertDispatch` | `DEP` | Persist the updated aggregate | -- |

---

## Decision Table

| Scenario | `safeGetDispatchById` :invalid_dispatch | `safeDeliver` :invalid_delivery_attempt | `recordDeliveryCore` :already_terminal | `(own)` :not_found | Outcome |
| --- | :---: | :---: | :---: | :---: | --- |
| OK delivered | pass | pass | pass | pass | delivered |
| OK attempt-recorded | pass | pass | pass | pass | attempt-recorded |
| OK max-attempts-exhausted | pass | pass | pass | pass | max-attempts-exhausted |
| FAIL invalid_dispatch | FAIL | -- | -- | -- | Fails: `invalid_dispatch` |
| FAIL invalid_delivery_attempt | pass | FAIL | -- | -- | Fails: `invalid_delivery_attempt` |
| FAIL already_terminal | pass | pass | FAIL | -- | Fails: `already_terminal` |
| FAIL not_found | pass | pass | pass | FAIL | Fails: `not_found` |
