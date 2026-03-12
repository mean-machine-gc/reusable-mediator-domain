# fail-processing-core

> Auto-generated from `fail-processing-core.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :already_terminal | Outcome |
| --- | :---: | --- |
| OK processing-failed | pass | processing-failed |
| FAIL already_terminal | FAIL | Fails: `already_terminal` |
