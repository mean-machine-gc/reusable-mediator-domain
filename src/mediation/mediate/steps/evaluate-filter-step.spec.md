# evaluate-filter-step

> Auto-generated from `evaluate-filter-step.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `resolveField` | `STEP` | Resolve field value from event | -- |
| 2 | `evaluateCondition` | `STEP` | Evaluate condition against field value | -- |
| 3 | `composeResults` | `STEP` | Compose boolean results with and/or logic | -- |

---

## Decision Table

| Scenario | Outcome |
| --- | --- |
| OK filter-matched | filter-matched |
| OK filter-rejected | filter-rejected |
