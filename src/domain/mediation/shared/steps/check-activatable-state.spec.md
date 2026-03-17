# check-activatable-state

> Auto-generated from `check-activatable-state.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :already_active | Outcome |
| --- | :---: | --- |
| OK activatable-state-confirmed | pass | activatable-state-confirmed |
| FAIL already_active | FAIL | Fails: `already_active` |
