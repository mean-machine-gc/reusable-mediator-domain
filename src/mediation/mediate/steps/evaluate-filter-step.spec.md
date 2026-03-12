# evaluate-filter-step

> Auto-generated from `evaluate-filter-step.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `resolveField` | `STEP` | Resolve field value from event | -- |
| 2 | `evaluateCondition` | `STRATEGY` | Evaluate condition against field value using operator-specific handler | -- |
| 3 | `composeResults` | `STEP` | Compose boolean results with and/or logic | -- |

---

## Decision Table

| Scenario | `evaluateCondition` _(strategy)_ | Outcome |
| --- | :---: | --- |
| OK filter-matched | pass _(?)_ | filter-matched |
| OK filter-rejected | pass _(?)_ | filter-rejected |
| _strategy_ |  | _See handler tables below_ |

---

### Strategy: `evaluateCondition`

#### Handler: `equals`

_No constraints — handler always succeeds._

#### Handler: `not_equals`

_No constraints — handler always succeeds._

#### Handler: `exists`

_No constraints — handler always succeeds._

#### Handler: `not_exists`

_No constraints — handler always succeeds._

#### Handler: `contains`

_No constraints — handler always succeeds._

#### Handler: `starts_with`

_No constraints — handler always succeeds._

#### Handler: `ends_with`

_No constraints — handler always succeeds._

#### Handler: `regex`

_No constraints — handler always succeeds._

#### Handler: `greater_than`

_No constraints — handler always succeeds._

#### Handler: `less_than`

_No constraints — handler always succeeds._

#### Handler: `greater_than_or_equal`

_No constraints — handler always succeeds._

#### Handler: `less_than_or_equal`

_No constraints — handler always succeeds._

#### Handler: `in`

_No constraints — handler always succeeds._

#### Handler: `not_in`

_No constraints — handler always succeeds._

