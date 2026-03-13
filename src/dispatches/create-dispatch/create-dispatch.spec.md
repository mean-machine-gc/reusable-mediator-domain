# create-dispatch

> Auto-generated from `create-dispatch.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `getDispatchById` | `DEP` | Load existing aggregate state from persistence (null if not found) | -- |
| 2 | `generateTimestamp` | `DEP` | Generate created timestamp from clock | -- |
| 3 | `createDispatchCore` | `STEP` | Validate state gate and assemble ToDeliverDispatch | `already_exists` |
| 4 | `upsertDispatch` | `DEP` | Persist the new aggregate | -- |

---

## Decision Table

| Scenario | `createDispatchCore` :already_exists | Outcome |
| --- | :---: | --- |
| OK dispatch-created | pass | dispatch-created |
| FAIL already_exists | FAIL | Fails: `already_exists` |
