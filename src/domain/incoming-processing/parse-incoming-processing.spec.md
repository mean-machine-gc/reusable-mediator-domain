# parse-incoming-processing

> Auto-generated from `parse-incoming-processing.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :invalid_incoming_processing | Outcome |
| --- | :---: | --- |
| OK incoming-processing-parsed | pass | incoming-processing-parsed |
| FAIL invalid_incoming_processing | FAIL | Fails: `invalid_incoming_processing` |
