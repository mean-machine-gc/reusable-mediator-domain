# create-dispatch-core

> Auto-generated from `create-dispatch-core.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :already_exists | Outcome |
| --- | :---: | --- |
| OK dispatch-created | pass | dispatch-created |
| FAIL already_exists | FAIL | Fails: `already_exists` |
