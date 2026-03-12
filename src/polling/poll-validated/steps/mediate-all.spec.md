# mediate-all

> Auto-generated from `mediate-all.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.
> For business-friendly documentation, see `/docs/`.

---

## Pipeline

| # | Name | Type | Description | Failure Codes |
| --- | --- | --- | --- | --- |
| 1 | `mediateCore` | `STEP` | Run mediation pipeline (filter/transform) for a single mediation | `unknown_transform` |

---

## Decision Table

| Scenario | `mediateCore.executeTransforms` :unknown_transform | Outcome |
| --- | :---: | --- |
| OK all-mediated | pass | all-mediated |
| FAIL unknown_transform | FAIL | Fails: `unknown_transform` |
