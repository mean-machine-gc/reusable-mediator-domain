# safe-get-mediation-by-id

> Auto-generated from `safe-get-mediation-by-id.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :invalid_mediation | Outcome |
| --- | :---: | --- |
| OK found | pass | found |
| OK not-found | pass | not-found |
| FAIL invalid_mediation | FAIL | Fails: `invalid_mediation` |
