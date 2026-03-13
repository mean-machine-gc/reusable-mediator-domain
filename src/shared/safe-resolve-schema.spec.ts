import type { SpecFn, Spec } from './spec-framework'

// ── Safe dep step: wraps resolveSchema dep with JSON Schema validation ─────

export type SafeResolveSchemaFailures = 'invalid_schema'

export type SafeResolveSchemaFn = SpecFn<
    string,
    object | null,
    SafeResolveSchemaFailures,
    'found' | 'not-found'
>

export const safeResolveSchemaSpec: Spec<SafeResolveSchemaFn> = {
    shouldFailWith: {
        invalid_schema: {
            description: 'Resolved value is not a valid JSON Schema',
            examples: [],
        },
    },
    shouldSucceedWith: {
        found: {
            description: 'A valid JSON Schema is resolved for the given URI',
            examples: [],
        },
        'not-found': {
            description: 'No schema is found for the given URI',
            examples: [],
        },
    },
    shouldAssert: {
        found: {},
        'not-found': {},
    },
}
