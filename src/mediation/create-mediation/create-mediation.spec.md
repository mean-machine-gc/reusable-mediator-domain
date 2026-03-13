# create-mediation

> Auto-generated from `create-mediation.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `generateId` | `DEP` | Generate a unique mediation ID | -- |
| 2 | `generateTimestamp` | `DEP` | Generate creation timestamp | -- |
| 3 | `assembleDraftMediation` | `STEP` | Assemble the draft mediation | -- |
| 4 | `upsertMediation` | `DEP` | Persist the new mediation | -- |

---

## Decision Table

| Scenario | Outcome |
| --- | --- |
| OK mediation-created | mediation-created |
