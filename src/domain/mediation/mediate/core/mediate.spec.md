# mediate

> Auto-generated from `mediate.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `executeFilters` | `STEP` | Run all filter steps | -- |
| 2 | `executeTransforms` | `STEP` | Apply all transformations | `unknown_transform` |

---

## Decision Table

| Scenario | `executeTransforms` :unknown_transform | Outcome |
| --- | :---: | --- |
| OK event-processed | pass | event-processed |
| OK event-skipped | pass | event-skipped |
| FAIL unknown_transform | FAIL | Fails: `unknown_transform` |
