# receive-event-shell

> Auto-generated from `receive-event-shell.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `parseProcessingId` | `STEP` | Parse and validate the processing ID | `not_a_string`, `empty`, `too_long_max_64`, `not_a_uuid`, `script_injection` |
| 2 | `loadState` | `DEP` | Load existing aggregate state from persistence (null if not found) | -- |
| 3 | `generateReceivedAt` | `DEP` | Generate received timestamp from clock | -- |
| 4 | `receiveEventCore` | `STEP` | Extract event info and assemble ReceivedProcessing | `already_exists`, `missing_event_type`, `missing_dataschema` |
| 5 | `save` | `DEP` | Persist the new aggregate | -- |

---

## Decision Table

| Scenario | `parseProcessingId` :not_a_string | `parseProcessingId` :empty | `parseProcessingId` :too_long_max_64 | `parseProcessingId` :not_a_uuid | `parseProcessingId` :script_injection | `receiveEventCore` :already_exists | `receiveEventCore` :missing_event_type | `receiveEventCore` :missing_dataschema | Outcome |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | --- |
| OK event-received | pass | pass | pass | pass | pass | pass | pass | pass | event-received |
| FAIL not_a_string | FAIL | -- | -- | -- | -- | -- | -- | -- | Fails: `not_a_string` |
| FAIL empty | pass | FAIL | -- | -- | -- | -- | -- | -- | Fails: `empty` |
| FAIL too_long_max_64 | pass | pass | FAIL | -- | -- | -- | -- | -- | Fails: `too_long_max_64` |
| FAIL not_a_uuid | pass | pass | pass | FAIL | -- | -- | -- | -- | Fails: `not_a_uuid` |
| FAIL script_injection | pass | pass | pass | pass | FAIL | -- | -- | -- | Fails: `script_injection` |
| FAIL already_exists | pass | pass | pass | pass | pass | FAIL | -- | -- | Fails: `already_exists` |
| FAIL missing_event_type | pass | pass | pass | pass | pass | pass | FAIL | -- | Fails: `missing_event_type` |
| FAIL missing_dataschema | pass | pass | pass | pass | pass | pass | pass | FAIL | Fails: `missing_dataschema` |
