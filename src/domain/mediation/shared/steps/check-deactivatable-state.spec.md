# check-deactivatable-state

> Auto-generated from `check-deactivatable-state.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :not_active | Outcome |
| --- | :---: | --- |
| OK deactivatable-state-confirmed | pass | deactivatable-state-confirmed |
| FAIL not_active | FAIL | Fails: `not_active` |
