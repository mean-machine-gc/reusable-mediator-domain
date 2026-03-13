# create-mediation

> Auto-generated from `create-mediation.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `safeGenerateId` | `SAFE-DEP` | Generate and validate a unique mediation ID | `invalid_id` |
| 2 | `safeGenerateTimestamp` | `SAFE-DEP` | Generate and validate creation timestamp | `invalid_timestamp` |
| 3 | `assembleDraftMediation` | `STEP` | Assemble the draft mediation | -- |
| 4 | `upsertMediation` | `DEP` | Persist the new mediation | -- |

---

## Decision Table

| Scenario | `safeGenerateId` :invalid_id | `safeGenerateTimestamp` :invalid_timestamp | Outcome |
| --- | :---: | :---: | --- |
| OK mediation-created | pass | pass | mediation-created |
| FAIL invalid_id | FAIL | -- | Fails: `invalid_id` |
| FAIL invalid_timestamp | pass | FAIL | Fails: `invalid_timestamp` |
