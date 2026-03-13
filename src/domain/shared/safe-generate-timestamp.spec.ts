import type { SpecFn, Spec } from './spec-framework'

// ── Safe dep step: wraps generateTimestamp dep with Timestamp validation ─────

export type SafeGenerateTimestampFailures = 'invalid_timestamp'

export type SafeGenerateTimestampFn = SpecFn<
    void,
    Date,
    SafeGenerateTimestampFailures,
    'generated'
>

export const safeGenerateTimestampSpec: Spec<SafeGenerateTimestampFn> = {
    shouldFailWith: {
        invalid_timestamp: {
            description: 'Generated value fails Timestamp schema validation',
            examples: [],
        },
    },
    shouldSucceedWith: {
        generated: {
            description: 'A valid Timestamp is generated',
            examples: [],
        },
    },
    shouldAssert: {
        generated: {},
    },
}
