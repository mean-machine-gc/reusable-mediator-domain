# mediate-processing

> Auto-generated from `mediate-processing.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `getIncomingProcessingById` | `DEP` | Load aggregate state from persistence | -- |
| 2 | `generateTimestamp` | `DEP` | Generate mediated timestamp from clock | -- |
| 3 | `mediateProcessingCore` | `STEP` | Attach outcomes and transition to mediated | `not_in_validated_state` |
| 4 | `upsertIncomingProcessing` | `DEP` | Persist the updated aggregate | -- |

---

## Decision Table

| Scenario | `mediateProcessingCore` :not_in_validated_state | `(own)` :not_found | Outcome |
| --- | :---: | :---: | --- |
| OK processing-mediated | pass | pass | processing-mediated |
| FAIL not_in_validated_state | FAIL | -- | Fails: `not_in_validated_state` |
| FAIL not_found | pass | FAIL | Fails: `not_found` |
