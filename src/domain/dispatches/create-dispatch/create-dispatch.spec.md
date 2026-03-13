# create-dispatch

> Auto-generated from `create-dispatch.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `safeGetDispatchById` | `SAFE-DEP` | Fetch and validate dispatch from persistence | `invalid_dispatch` |
| 2 | `safeGenerateTimestamp` | `SAFE-DEP` | Generate and validate created timestamp | `invalid_timestamp` |
| 3 | `createDispatchCore` | `STEP` | Validate state gate and assemble ToDeliverDispatch | `already_exists` |
| 4 | `upsertDispatch` | `DEP` | Persist the new aggregate | -- |

---

## Decision Table

| Scenario | `safeGetDispatchById` :invalid_dispatch | `safeGenerateTimestamp` :invalid_timestamp | `createDispatchCore` :already_exists | Outcome |
| --- | :---: | :---: | :---: | --- |
| OK dispatch-created | pass | pass | pass | dispatch-created |
| FAIL invalid_dispatch | FAIL | -- | -- | Fails: `invalid_dispatch` |
| FAIL invalid_timestamp | pass | FAIL | -- | Fails: `invalid_timestamp` |
| FAIL already_exists | pass | pass | FAIL | Fails: `already_exists` |
