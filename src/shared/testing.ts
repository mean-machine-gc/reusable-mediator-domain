// shared/testing.ts

import type {
  Result, FunctionSpec, FactorySpec, ShellFactorySpec,
} from './spec'

// ── runSpec — atomic functions (sync) ────────────────────────────────────────
// Reads predicates and examples from the spec itself — no separate examples arg.

export const runSpec = <In, Out, F extends string, S extends string>(
  fn:   (input: In) => Result<Out, F, S>,
  spec: FunctionSpec<In, Out, F, S>,
): void => {
  describe('failures', () => {
    for (const [failure, constraint] of Object.entries(spec.constraints) as [F, { predicate: any; examples: { when: In }[] }][]) {
      describe(failure, () => {
        constraint.examples.forEach((example, i) => {
          const label = constraint.examples.length === 1 ? failure : `${failure} [${i + 1}]`
          test(label, () => {
            const result = fn(example.when)
            expect(result.ok).toBe(false)
            if (!result.ok) expect(result.errors).toContain(failure)
          })
        })
      })
    }
  })

  if (spec.mixed && spec.mixed.length > 0) {
    describe('mixed failures', () => {
      for (const example of spec.mixed!) {
        test(example.description, () => {
          const result = fn(example.when)
          expect(result.ok).toBe(false)
          if (!result.ok) {
            for (const f of example.failsWith) {
              expect(result.errors).toContain(f)
            }
          }
        })
      }
    })
  }

  for (const [successType, successSpec] of Object.entries(spec.successes) as [S, any][]) {
    describe(successType, () => {
      successSpec.examples.forEach((example: { when: In; then: Out }, i: number) => {
        const suffix = successSpec.examples.length > 1 ? ` [${i + 1}]` : ''

        test(`condition${suffix}`, () => {
          const result = fn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok)
            expect(successSpec.condition({ input: example.when, output: result.value })).toBe(true)
        })

        for (const [name, assertion] of Object.entries(successSpec.assertions ?? {}) as [string, any][]) {
          test(`${name}${suffix}`, () => {
            const result = fn(example.when)
            expect(result.ok).toBe(true)
            if (result.ok)
              expect(assertion({ input: example.when, output: result.value })).toBe(true)
          })
        }

        test(`expected value${suffix}`, () => {
          const result = fn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok) expect(result.value).toEqual(example.then)
        })

        test(`success type${suffix}`, () => {
          const result = fn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok) expect(result.successType).toContain(successType)
        })
      })
    })
  }
}

// ── runSpecAsync — async atomic functions ────────────────────────────────────

export const runSpecAsync = <In, Out, F extends string, S extends string>(
  fn:   (input: In) => Promise<Result<Out, F, S>>,
  spec: FunctionSpec<In, Out, F, S>,
): void => {
  describe('failures', () => {
    for (const [failure, constraint] of Object.entries(spec.constraints) as [F, { predicate: any; examples: { when: In }[] }][]) {
      describe(failure, () => {
        constraint.examples.forEach((example, i) => {
          const label = constraint.examples.length === 1 ? failure : `${failure} [${i + 1}]`
          test(label, async () => {
            const result = await fn(example.when)
            expect(result.ok).toBe(false)
            if (!result.ok) expect(result.errors).toContain(failure)
          })
        })
      })
    }
  })

  if (spec.mixed && spec.mixed.length > 0) {
    describe('mixed failures', () => {
      for (const example of spec.mixed!) {
        test(example.description, async () => {
          const result = await fn(example.when)
          expect(result.ok).toBe(false)
          if (!result.ok) {
            for (const f of example.failsWith) {
              expect(result.errors).toContain(f)
            }
          }
        })
      }
    })
  }

  for (const [successType, successSpec] of Object.entries(spec.successes) as [S, any][]) {
    describe(successType, () => {
      successSpec.examples.forEach((example: { when: In; then: Out }, i: number) => {
        const suffix = successSpec.examples.length > 1 ? ` [${i + 1}]` : ''

        test(`condition${suffix}`, async () => {
          const result = await fn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok)
            expect(successSpec.condition({ input: example.when, output: result.value })).toBe(true)
        })

        for (const [name, assertion] of Object.entries(successSpec.assertions ?? {}) as [string, any][]) {
          test(`${name}${suffix}`, async () => {
            const result = await fn(example.when)
            expect(result.ok).toBe(true)
            if (result.ok)
              expect(assertion({ input: example.when, output: result.value })).toBe(true)
          })
        }

        test(`expected value${suffix}`, async () => {
          const result = await fn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok) expect(result.value).toEqual(example.then)
        })

        test(`success type${suffix}`, async () => {
          const result = await fn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok) expect(result.successType).toContain(successType)
        })
      })
    })
  }
}

// ── runFactorySpec — core factories (sync) ──────────────────────────────────
// Factories have `failures` (examples only, no predicates) instead of `constraints`.
// No assertions — conditions + expected value match only.

export const runFactorySpec = <In, Out, F extends string, S extends string>(
  fn:   (input: In) => Result<Out, F, S>,
  spec: FactorySpec<In, Out, F, S>,
): void => {
  describe('failures', () => {
    for (const [failure, failureExamples] of Object.entries(spec.failures) as [F, { when: In }[]][]) {
      describe(failure, () => {
        failureExamples.forEach((example, i) => {
          const label = failureExamples.length === 1 ? failure : `${failure} [${i + 1}]`
          test(label, () => {
            const result = fn(example.when)
            expect(result.ok).toBe(false)
            if (!result.ok) expect(result.errors).toContain(failure)
          })
        })
      })
    }
  })

  if (spec.mixed && spec.mixed.length > 0) {
    describe('mixed failures', () => {
      for (const example of spec.mixed!) {
        test(example.description, () => {
          const result = fn(example.when)
          expect(result.ok).toBe(false)
          if (!result.ok) {
            for (const f of example.failsWith) {
              expect(result.errors).toContain(f)
            }
          }
        })
      }
    })
  }

  for (const [successType, successSpec] of Object.entries(spec.successes) as [S, any][]) {
    describe(successType, () => {
      successSpec.examples.forEach((example: { when: In; then: Out }, i: number) => {
        const suffix = successSpec.examples.length > 1 ? ` [${i + 1}]` : ''

        test(`condition${suffix}`, () => {
          const result = fn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok)
            expect(successSpec.condition({ input: example.when, output: result.value })).toBe(true)
        })

        test(`expected value${suffix}`, () => {
          const result = fn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok) expect(result.value).toEqual(example.then)
        })

        test(`success type${suffix}`, () => {
          const result = fn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok) expect(result.successType).toContain(successType)
        })
      })
    })
  }
}

// ── runFactorySpecAsync — async factories ───────────────────────────────────

export const runFactorySpecAsync = <In, Out, F extends string, S extends string>(
  fn:   (input: In) => Promise<Result<Out, F, S>>,
  spec: FactorySpec<In, Out, F, S>,
): void => {
  describe('failures', () => {
    for (const [failure, failureExamples] of Object.entries(spec.failures) as [F, { when: In }[]][]) {
      describe(failure, () => {
        failureExamples.forEach((example, i) => {
          const label = failureExamples.length === 1 ? failure : `${failure} [${i + 1}]`
          test(label, async () => {
            const result = await fn(example.when)
            expect(result.ok).toBe(false)
            if (!result.ok) expect(result.errors).toContain(failure)
          })
        })
      })
    }
  })

  if (spec.mixed && spec.mixed.length > 0) {
    describe('mixed failures', () => {
      for (const example of spec.mixed!) {
        test(example.description, async () => {
          const result = await fn(example.when)
          expect(result.ok).toBe(false)
          if (!result.ok) {
            for (const f of example.failsWith) {
              expect(result.errors).toContain(f)
            }
          }
        })
      }
    })
  }

  for (const [successType, successSpec] of Object.entries(spec.successes) as [S, any][]) {
    describe(successType, () => {
      successSpec.examples.forEach((example: { when: In; then: Out }, i: number) => {
        const suffix = successSpec.examples.length > 1 ? ` [${i + 1}]` : ''

        test(`condition${suffix}`, async () => {
          const result = await fn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok)
            expect(successSpec.condition({ input: example.when, output: result.value })).toBe(true)
        })

        test(`expected value${suffix}`, async () => {
          const result = await fn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok) expect(result.value).toEqual(example.then)
        })

        test(`success type${suffix}`, async () => {
          const result = await fn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok) expect(result.successType).toContain(successType)
        })
      })
    })
  }
}

// ── runShellSpec — shell factories (async + dep propagation) ────────────────
// Reads baseDeps and depPropagation from the spec itself.

export const runShellSpec = <
  In, Out, F extends string, S extends string,
  Deps extends Record<string, any>
>(
  fn:     (input: In) => Promise<Result<Out, F, S>>,
  makeFn: (deps: Deps) => (input: In) => Promise<Result<Out, F, S>>,
  spec:   ShellFactorySpec<In, Out, F, S, Deps>,
): void => {
  // ── Failures (with optional per-failure dep overrides) ──────────────────
  describe('failures', () => {
    for (const [failure, failureExamples] of Object.entries(spec.failures) as [F, { when: In }[]][]) {
      describe(failure, () => {
        const override = spec.baseDepsOverrides?.[failure]
        const testFn = override ? makeFn({ ...spec.baseDeps, ...override } as Deps) : fn

        failureExamples.forEach((example, i) => {
          const label = failureExamples.length === 1 ? failure : `${failure} [${i + 1}]`
          test(label, async () => {
            const result = await testFn(example.when)
            expect(result.ok).toBe(false)
            if (!result.ok) expect(result.errors).toContain(failure)
          })
        })
      })
    }
  })

  if (spec.mixed && spec.mixed.length > 0) {
    describe('mixed failures', () => {
      for (const example of spec.mixed!) {
        test(example.description, async () => {
          const result = await fn(example.when)
          expect(result.ok).toBe(false)
          if (!result.ok) {
            for (const f of example.failsWith) {
              expect(result.errors).toContain(f)
            }
          }
        })
      }
    })
  }

  // ── Successes (with optional per-success dep overrides) ─────────────────
  for (const [successType, successSpec] of Object.entries(spec.successes) as [S, any][]) {
    describe(successType, () => {
      const override = spec.baseDepsOverrides?.[successType]
      const testFn = override ? makeFn({ ...spec.baseDeps, ...override } as Deps) : fn

      successSpec.examples.forEach((example: { when: In; then: Out }, i: number) => {
        const suffix = successSpec.examples.length > 1 ? ` [${i + 1}]` : ''

        test(`condition${suffix}`, async () => {
          const result = await testFn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok)
            expect(successSpec.condition({ input: example.when, output: result.value })).toBe(true)
        })

        test(`expected value${suffix}`, async () => {
          const result = await testFn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok) expect(result.value).toEqual(example.then)
        })

        test(`success type${suffix}`, async () => {
          const result = await testFn(example.when)
          expect(result.ok).toBe(true)
          if (result.ok) expect(result.successType).toContain(successType)
        })
      })
    })
  }

  // ── Dep propagation ─────────────────────────────────────────────────────
  describe('dep propagation', () => {
    for (const [depName, prop] of Object.entries(spec.depPropagation) as [string, { when: In; failsWith: string }][]) {
      test(`propagates ${depName} failure`, async () => {
        const override = { [depName]: async () => ({ ok: false, errors: [prop.failsWith] }) }
        const fn = makeFn({ ...spec.baseDeps, ...override } as Deps)
        const result = await fn(prop.when)
        expect(result.ok).toBe(false)
        if (!result.ok) expect(result.errors).toContain(prop.failsWith)
      })
    }
  })
}
