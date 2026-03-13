# receive-event

> Auto-generated from `receive-event.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `safeGetIncomingProcessingById` | `SAFE-DEP` | Fetch and validate incoming processing from persistence | `invalid_incoming_processing` |
| 2 | `safeGenerateTimestamp` | `SAFE-DEP` | Generate and validate received timestamp | `invalid_timestamp` |
| 3 | `receiveEventCore` | `STEP` | Extract event info and assemble ReceivedProcessing | `already_exists`, `missing_event_type`, `missing_dataschema` |
| 4 | `upsertIncomingProcessing` | `DEP` | Persist the new aggregate | -- |

---

## Decision Table

| Scenario | `safeGetIncomingProcessingById` :invalid_incoming_processing | `safeGenerateTimestamp` :invalid_timestamp | `receiveEventCore` :already_exists | `receiveEventCore` :missing_event_type | `receiveEventCore` :missing_dataschema | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | --- |
| OK event-received | pass | pass | pass | pass | pass | event-received |
| FAIL invalid_incoming_processing | FAIL | -- | -- | -- | -- | Fails: `invalid_incoming_processing` |
| FAIL invalid_timestamp | pass | FAIL | -- | -- | -- | Fails: `invalid_timestamp` |
| FAIL already_exists | pass | pass | FAIL | -- | -- | Fails: `already_exists` |
| FAIL missing_event_type | pass | pass | pass | FAIL | -- | Fails: `missing_event_type` |
| FAIL missing_dataschema | pass | pass | pass | pass | FAIL | Fails: `missing_dataschema` |
