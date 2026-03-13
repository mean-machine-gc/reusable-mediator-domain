import type { SpecFn, Spec } from '../shared/spec-framework'
import type { Dispatch } from './types'
import { valid, invalid } from './fixtures'

// ── Safe dep step: wraps getDispatchById dep with Dispatch parsing ─────

export type SafeGetDispatchByIdFailures = 'invalid_dispatch'

export type SafeGetDispatchByIdFn = SpecFn<
    string,
    Dispatch | null,
    SafeGetDispatchByIdFailures,
    'found' | 'not-found'
>

export const safeGetDispatchByIdSpec: Spec<SafeGetDispatchByIdFn> = {
    shouldFailWith: {
        invalid_dispatch: {
            description: 'Persisted data fails Dispatch schema validation',
            examples: [],
        },
    },
    shouldSucceedWith: {
        found: {
            description: 'A valid Dispatch aggregate is returned',
            examples: [],
        },
        'not-found': {
            description: 'No Dispatch aggregate exists for the given ID',
            examples: [],
        },
    },
    shouldAssert: {
        found: {},
        'not-found': {},
    },
}
