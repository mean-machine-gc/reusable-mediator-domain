# record-delivery-core

> Auto-generated from `record-delivery-core.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :already_terminal | Outcome |
| --- | :---: | --- |
| OK delivered | pass | delivered |
| OK attempt-recorded | pass | attempt-recorded |
| OK max-attempts-exhausted | pass | max-attempts-exhausted |
| FAIL already_terminal | FAIL | Fails: `already_terminal` |
