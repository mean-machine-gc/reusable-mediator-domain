# safe-resolve-schema

> Auto-generated from `safe-resolve-schema.spec.ts`. Do not edit — run `npm run gen:specs` to regenerate.

---

## Pipeline

_Atomic function — no pipeline steps._

---

## Decision Table

| Scenario | `(self)` :invalid_schema | Outcome |
| --- | :---: | --- |
| OK found | pass | found |
| OK not-found | pass | not-found |
| FAIL invalid_schema | FAIL | Fails: `invalid_schema` |
