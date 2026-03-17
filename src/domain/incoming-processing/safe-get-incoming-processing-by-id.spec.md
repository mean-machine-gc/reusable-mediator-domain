# safe-get-incoming-processing-by-id

> Auto-generated from `safe-get-incoming-processing-by-id.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :invalid_incoming_processing | Outcome |
| --- | :---: | --- |
| OK found | pass | found |
| OK not-found | pass | not-found |
| FAIL invalid_incoming_processing | FAIL | Fails: `invalid_incoming_processing` |
