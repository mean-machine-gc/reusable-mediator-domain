# record-delivery

> Auto-generated from `record-delivery.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `getDispatchById` | `DEP` | Load aggregate state from persistence | -- |
| 2 | `deliver` | `DEP` | Attempt HTTP delivery to destination, returns DeliveryAttempt | -- |
| 3 | `getMaxAttempts` | `DEP` | Retrieve the max attempts configuration | -- |
| 4 | `recordDeliveryCore` | `STEP` | Evaluate attempt result, transition state accordingly | `already_terminal` |
| 5 | `upsertDispatch` | `DEP` | Persist the updated aggregate | -- |

---

## Decision Table

| Scenario | `recordDeliveryCore` :already_terminal | `(own)` :not_found | Outcome |
| --- | :---: | :---: | --- |
| OK delivered | pass | pass | delivered |
| OK attempt-recorded | pass | pass | attempt-recorded |
| OK max-attempts-exhausted | pass | pass | max-attempts-exhausted |
| FAIL already_terminal | FAIL | -- | Fails: `already_terminal` |
| FAIL not_found | pass | FAIL | Fails: `not_found` |
