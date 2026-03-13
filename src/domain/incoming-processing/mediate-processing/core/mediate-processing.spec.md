# mediate-processing-core

> Auto-generated from `mediate-processing-core.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :not_in_validated_state | Outcome |
| --- | :---: | --- |
| OK processing-mediated | pass | processing-mediated |
| FAIL not_in_validated_state | FAIL | Fails: `not_in_validated_state` |
