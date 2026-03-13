import type { SpecFn, Spec } from '../shared/spec-framework'
import type { IncomingProcessing } from './types'
import { valid, invalid } from './fixtures'

// ── Safe dep step: wraps getIncomingProcessingById dep with IncomingProcessing parsing ─────

export type SafeGetIncomingProcessingByIdFailures = 'invalid_incoming_processing'

export type SafeGetIncomingProcessingByIdFn = SpecFn<
    string,
    IncomingProcessing | null,
    SafeGetIncomingProcessingByIdFailures,
    'found' | 'not-found'
>

export const safeGetIncomingProcessingByIdSpec: Spec<SafeGetIncomingProcessingByIdFn> = {
    shouldFailWith: {
        invalid_incoming_processing: {
            description: 'Persisted data fails IncomingProcessing schema validation',
            examples: [],
        },
    },
    shouldSucceedWith: {
        found: {
            description: 'A valid IncomingProcessing aggregate is returned',
            examples: [],
        },
        'not-found': {
            description: 'No IncomingProcessing aggregate exists for the given ID',
            examples: [],
        },
    },
    shouldAssert: {
        found: {},
        'not-found': {},
    },
}
