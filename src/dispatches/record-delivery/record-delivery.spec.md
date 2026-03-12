# record-delivery-shell

> Auto-generated from `record-delivery-shell.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `parseDispatchId` | `STEP` | Parse and validate the dispatch ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `loadState` | `DEP` | Load aggregate state from persistence | -- |
| 3 | `deliver` | `DEP` | Attempt HTTP delivery to destination, returns DeliveryAttempt | -- |
| 4 | `getMaxAttempts` | `DEP` | Retrieve the max attempts configuration | -- |
| 5 | `recordDeliveryCore` | `STEP` | Evaluate attempt result, transition state accordingly | `already_terminal` |
| 6 | `save` | `DEP` | Persist the updated aggregate | -- |

---

## Decision Table

| Scenario | `parseDispatchId` :not_a_string | `parseDispatchId` :empty | `parseDispatchId` :too_long_max_64 | `parseDispatchId` :not_a_uuid | `parseDispatchId` :script_injection | `recordDeliveryCore` :already_terminal | `(own)` :not_found | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| OK delivered | pass | pass | pass | pass | pass | pass | pass | delivered |
| OK attempt-recorded | pass | pass | pass | pass | pass | pass | pass | attempt-recorded |
| OK max-attempts-exhausted | pass | pass | pass | pass | pass | pass | pass | max-attempts-exhausted |
| FAIL not_a_string | FAIL | -- | -- | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | FAIL | -- | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_64 | pass | pass | FAIL | -- | -- | -- | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | pass | pass | pass | FAIL | -- | -- | -- | Fails: `not_a_uuid` |
| FAIL script_injection | pass | pass | pass | pass | FAIL | -- | -- | Fails: `script_injection` |
| FAIL already_terminal | pass | pass | pass | pass | pass | FAIL | -- | Fails: `already_terminal` |
| FAIL not_found | pass | pass | pass | pass | pass | pass | FAIL | Fails: `not_found` |
