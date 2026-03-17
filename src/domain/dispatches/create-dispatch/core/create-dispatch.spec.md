# create-dispatch

> Auto-generated from `create-dispatch.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :already_exists | Outcome |
| --- | :---: | --- |
| OK dispatch-created | pass | dispatch-created |
| FAIL already_exists | FAIL | Fails: `already_exists` |
