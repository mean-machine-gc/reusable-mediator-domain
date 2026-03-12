# create-dispatch-shell

> Auto-generated from `create-dispatch-shell.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `parseDispatchId` | `STEP` | Parse and validate the dispatch ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `loadState` | `DEP` | Load existing aggregate state from persistence (null if not found) | -- |
| 3 | `generateCreatedAt` | `DEP` | Generate created timestamp from clock | -- |
| 4 | `createDispatchCore` | `STEP` | Validate state gate and assemble ToDeliverDispatch | `already_exists` |
| 5 | `save` | `DEP` | Persist the new aggregate | -- |

---

## Decision Table

| Scenario | `parseDispatchId` :not_a_string | `parseDispatchId` :empty | `parseDispatchId` :too_long_max_64 | `parseDispatchId` :not_a_uuid | `parseDispatchId` :script_injection | `createDispatchCore` :already_exists | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| OK dispatch-created | pass | pass | pass | pass | pass | pass | dispatch-created |
| FAIL not_a_string | FAIL | -- | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | FAIL | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_64 | pass | pass | FAIL | -- | -- | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | pass | pass | pass | FAIL | -- | -- | Fails: `not_a_uuid` |
| FAIL script_injection | pass | pass | pass | pass | FAIL | -- | Fails: `script_injection` |
| FAIL already_exists | pass | pass | pass | pass | pass | FAIL | Fails: `already_exists` |
