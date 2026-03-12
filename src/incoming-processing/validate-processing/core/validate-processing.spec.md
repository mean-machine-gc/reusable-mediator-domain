# validate-processing-core

> Auto-generated from `validate-processing-core.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :not_in_received_state | `(self)` :schema_validation_failed | Outcome |
| --- | :---: | :---: | --- |
| OK processing-validated | pass | pass | processing-validated |
| FAIL not_in_received_state | FAIL | -- | Fails: `not_in_received_state` |
| FAIL schema_validation_failed | pass | FAIL | Fails: `schema_validation_failed` |
