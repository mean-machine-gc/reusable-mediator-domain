# fail-processing

> Auto-generated from `fail-processing.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | [`safeGetIncomingProcessingById`](../safe-get-incoming-processing-by-id.spec.md) | `SAFE-DEP` | Fetch and validate incoming processing from persistence | `invalid_incoming_processing` |
| 2 | [`safeGenerateTimestamp`](../../shared/safe-generate-timestamp.spec.md) | `SAFE-DEP` | Generate and validate failed timestamp | `invalid_timestamp` |
| 3 | [`failProcessingCore`](core/fail-processing.spec.md) | `STEP` | Validate state gate and transition to failed | `already_terminal` |
| 4 | `upsertIncomingProcessing` | `DEP` | Persist the updated aggregate | -- |

---

## Decision Table

| Scenario | `safeGetIncomingProcessingById` :invalid_incoming_processing | `safeGenerateTimestamp` :invalid_timestamp | `failProcessingCore` :already_terminal | `(own)` :not_found | Outcome |
| --- | :---: | :---: | :---: | :---: | --- |
| OK processing-failed | pass | pass | pass | pass | processing-failed |
| FAIL invalid_incoming_processing | FAIL | -- | -- | -- | Fails: `invalid_incoming_processing` |
| FAIL invalid_timestamp | pass | FAIL | -- | -- | Fails: `invalid_timestamp` |
| FAIL already_terminal | pass | pass | FAIL | -- | Fails: `already_terminal` |
| FAIL not_found | pass | pass | pass | FAIL | Fails: `not_found` |
