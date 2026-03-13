import type { SpecFn, Spec } from '../shared/spec-framework'
import type { Mediation } from './types'
import { valid, invalid } from './fixtures'

// ── Safe dep step: wraps getMediationById dep with Mediation parsing ─────

export type SafeGetMediationByIdFailures = 'invalid_mediation'

export type SafeGetMediationByIdFn = SpecFn<
    string,
    Mediation | null,
    SafeGetMediationByIdFailures,
    'found' | 'not-found'
>

export const safeGetMediationByIdSpec: Spec<SafeGetMediationByIdFn> = {
    shouldFailWith: {
        invalid_mediation: {
            description: 'Persisted data fails Mediation schema validation',
            examples: [],
        },
    },
    shouldSucceedWith: {
        found: {
            description: 'A valid Mediation aggregate is returned',
            examples: [],
        },
        'not-found': {
            description: 'No Mediation aggregate exists for the given ID',
            examples: [],
        },
    },
    shouldAssert: {
        found: {},
        'not-found': {},
    },
}
