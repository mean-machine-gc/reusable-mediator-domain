# safe-get-dispatch-by-id

> Auto-generated from `safe-get-dispatch-by-id.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :invalid_dispatch | Outcome |
| --- | :---: | --- |
| OK found | pass | found |
| OK not-found | pass | not-found |
| FAIL invalid_dispatch | FAIL | Fails: `invalid_dispatch` |
