// shared/spec.ts

// ── Result ──────────────────────────────────────────────────────────────────

export type Result<T, F extends string = string, S extends string = string> =
  | { ok: true; value: T; successType: S[] }
  | { ok: false; errors: F[] }

// ── Spec Predicates ─────────────────────────────────────────────────────────

export type ConstraintPredicate<In> =
  (args: { input: In }) => boolean

export type ConditionPredicate<In, Out> =
  (args: { input: In; output: Out }) => boolean

export type AssertionPredicate<In, Out> =
  (args: { input: In; output: Out }) => boolean

// ── Example Types ───────────────────────────────────────────────────────────

export type FailureExample<In> = { when: In }
export type SuccessExample<In, Out> = { when: In; then: Out }
export type MixedFailureExample<In, F extends string> = {
  description: string
  when: In
  failsWith: F[]
}
export type DepPropagationExample<In> = { when: In; failsWith: string }

// Non-empty tuple — compiler guarantees at least one example per key
export type OneOrMore<T> = [T, ...T[]]

// ── FunctionSpec — atomic functions ─────────────────────────────────────────
// Each constraint has its predicate AND its failure examples together.
// Each success type has its condition, assertions, AND its success examples.
// The rule and its proof live in one object.

export type FunctionSpec<In, Out, F extends string, S extends string> = {
  constraints: Record<F, {
    predicate: ConstraintPredicate<In>
    examples: OneOrMore<FailureExample<In>>
  }>
  successes: Record<S, {
    condition: ConditionPredicate<In, Out>
    assertions: Record<string, AssertionPredicate<In, Out>>
    examples: OneOrMore<SuccessExample<In, Out>>
  }>
  mixed?: MixedFailureExample<In, F>[]
}

// ── FactorySpec — factories that compose steps ──────────────────────────────
// No constraint predicates (inherited from step specs). Failure examples are
// factory-level inputs that trigger step failures through real steps.
// No assertions — expected value match suffices for factories.
// Steps can be atomic (FunctionSpec) or nested factories (FactorySpec).

export type StepSpec =
  | FunctionSpec<any, any, string, string>
  | FactorySpec<any, any, string, string>

export type FactorySpec<In, Out, F extends string, S extends string> = {
  steps: Record<string, StepSpec>
  deps?: Record<string, { failures: string[] }>
  failures: Record<F, OneOrMore<FailureExample<In>>>
  successes: Record<S, {
    condition: ConditionPredicate<In, Out>
    examples: OneOrMore<SuccessExample<In, Out>>
  }>
  mixed?: MixedFailureExample<In, F>[]
}

// ── ShellFactorySpec — shell factories with dep propagation ─────────────────

export type ShellFactorySpec<
  In, Out, F extends string, S extends string,
  Deps extends Record<string, any>
> = FactorySpec<In, Out, F, S> & {
  baseDeps: Deps
  baseDepsOverrides?: Partial<Record<F | S, Partial<Deps>>>
  depPropagation: Record<keyof Deps, DepPropagationExample<In>>
}
