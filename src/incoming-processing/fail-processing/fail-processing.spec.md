# fail-processing

> Auto-generated from `fail-processing.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `getIncomingProcessingById` | `DEP` | Load aggregate state from persistence | -- |
| 2 | `generateTimestamp` | `DEP` | Generate failed timestamp from clock | -- |
| 3 | `failProcessingCore` | `STEP` | Validate state gate and transition to failed | `already_terminal` |
| 4 | `upsertIncomingProcessing` | `DEP` | Persist the updated aggregate | -- |

---

## Decision Table

| Scenario | `failProcessingCore` :already_terminal | `(own)` :not_found | Outcome |
| --- | :---: | :---: | --- |
| OK processing-failed | pass | pass | processing-failed |
| FAIL already_terminal | FAIL | -- | Fails: `already_terminal` |
| FAIL not_found | pass | FAIL | Fails: `not_found` |
