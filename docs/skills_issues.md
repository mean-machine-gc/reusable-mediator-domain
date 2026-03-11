---
layout: default
title: Skills Issues
nav_order: 99
---

# Skills Issues

## 1. Shell success type conditions can't distinguish state-dependent outcomes

**Context:** `activateMediation` shell has two success types (`draft-activated`, `reactivated`) forwarded from the core. The core can distinguish them because its input includes `state: Mediation`. The shell input is just `{ cmd }` — it doesn't carry the aggregate state.

**Problem:** Shell success conditions receive `{ input: ShellInput, output: ShellOutput }`. Since `ShellInput = { cmd }` and `ShellOutput = ActiveMediation` (same shape in both cases), there's no way to write a meaningful condition predicate at the shell level.

**Current workaround:** Both shell success conditions are `() => true`. The core tests verify the correct classification. The shell tests verify each path end-to-end via `baseDepsOverrides`.

**Possible resolutions:**
- **Option A:** Shell conditions delegate to core conditions by reconstructing a partial core input from the dep results (would require the spec to capture intermediate dep values).
- **Option B:** The output type carries a trace of the origin state (e.g. `previousStatus` field on `ActiveMediation`), making the shell condition possible.
- **Option C:** Accept that shell success types forward core types but conditions are only meaningful at the core level. The shell spec documents the types for consumers but can't independently verify which one fired — the core tests cover that.
- **Option D:** Evolve the `ConditionPredicate` for shell specs to receive additional context (e.g. dep results, intermediate pipeline values) beyond just input/output.

**Affected operations:** Any shell factory wrapping a core with state-dependent success types (activateMediation, likely deactivateMediation, and any future command with multiple success outcomes based on aggregate state).
