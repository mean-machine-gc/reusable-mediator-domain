# receive-event-core

> Auto-generated from `receive-event-core.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :already_exists | `(self)` :missing_event_type | `(self)` :missing_dataschema | Outcome |
| --- | :---: | :---: | :---: | --- |
| OK event-received | pass | pass | pass | event-received |
| FAIL already_exists | FAIL | -- | -- | Fails: `already_exists` |
| FAIL missing_event_type | pass | FAIL | -- | Fails: `missing_event_type` |
| FAIL missing_dataschema | pass | pass | FAIL | Fails: `missing_dataschema` |
