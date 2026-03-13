# receive-event

> Auto-generated from `receive-event.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `getIncomingProcessingById` | `DEP` | Load existing aggregate state from persistence (null if not found) | -- |
| 2 | `generateTimestamp` | `DEP` | Generate received timestamp from clock | -- |
| 3 | `receiveEventCore` | `STEP` | Extract event info and assemble ReceivedProcessing | `already_exists`, `missing_event_type`, `missing_dataschema` |
| 4 | `upsertIncomingProcessing` | `DEP` | Persist the new aggregate | -- |

---

## Decision Table

| Scenario | `receiveEventCore` :already_exists | `receiveEventCore` :missing_event_type | `receiveEventCore` :missing_dataschema | Outcome |
| --- | :---: | :---: | :---: | --- |
| OK event-received | pass | pass | pass | event-received |
| FAIL already_exists | FAIL | -- | -- | Fails: `already_exists` |
| FAIL missing_event_type | pass | FAIL | -- | Fails: `missing_event_type` |
| FAIL missing_dataschema | pass | pass | FAIL | Fails: `missing_dataschema` |
