import type { SpecFn, Spec } from './spec-framework'

// ── Safe dep step: wraps generateId dep with ID validation ─────

export type SafeGenerateIdFailures = 'invalid_id'

export type SafeGenerateIdFn = SpecFn<
    void,
    string,
    SafeGenerateIdFailures,
    'generated'
>

export const safeGenerateIdSpec: Spec<SafeGenerateIdFn> = {
    shouldFailWith: {
        invalid_id: {
            description: 'Generated value fails ID schema validation',
            examples: [],
        },
    },
    shouldSucceedWith: {
        generated: {
            description: 'A valid ID is generated',
            examples: [],
        },
    },
    shouldAssert: {
        generated: {},
    },
}
