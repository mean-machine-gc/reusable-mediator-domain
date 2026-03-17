# parse-command

> Auto-generated from `parse-command.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :invalid_receive_event_command | Outcome |
| --- | :---: | --- |
| OK command-parsed | pass | command-parsed |
| FAIL invalid_receive_event_command | FAIL | Fails: `invalid_receive_event_command` |
