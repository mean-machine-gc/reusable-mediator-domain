# mediate-processing

> Auto-generated from `mediate-processing.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | [`safeGetIncomingProcessingById`](../safe-get-incoming-processing-by-id.spec.md) | `SAFE-DEP` | Fetch and validate incoming processing from persistence | `invalid_incoming_processing` |
| 2 | [`safeGenerateTimestamp`](../../shared/safe-generate-timestamp.spec.md) | `SAFE-DEP` | Generate and validate mediated timestamp | `invalid_timestamp` |
| 3 | [`mediateProcessingCore`](core/mediate-processing.spec.md) | `STEP` | Attach outcomes and transition to mediated | `not_in_validated_state` |
| 4 | `upsertIncomingProcessing` | `DEP` | Persist the updated aggregate | -- |

---

## Decision Table

| Scenario | `safeGetIncomingProcessingById` :invalid_incoming_processing | `safeGenerateTimestamp` :invalid_timestamp | `mediateProcessingCore` :not_in_validated_state | `(own)` :not_found | Outcome |
| --- | :---: | :---: | :---: | :---: | --- |
| OK processing-mediated | pass | pass | pass | pass | processing-mediated |
| FAIL invalid_incoming_processing | FAIL | -- | -- | -- | Fails: `invalid_incoming_processing` |
| FAIL invalid_timestamp | pass | FAIL | -- | -- | Fails: `invalid_timestamp` |
| FAIL not_in_validated_state | pass | pass | FAIL | -- | Fails: `not_in_validated_state` |
| FAIL not_found | pass | pass | pass | FAIL | Fails: `not_found` |
