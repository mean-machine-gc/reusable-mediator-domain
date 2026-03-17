# safe-deliver

> Auto-generated from `safe-deliver.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :invalid_delivery_attempt | Outcome |
| --- | :---: | --- |
| OK delivery-successful | pass | delivery-successful |
| OK delivery-failed | pass | delivery-failed |
| FAIL invalid_delivery_attempt | FAIL | Fails: `invalid_delivery_attempt` |
