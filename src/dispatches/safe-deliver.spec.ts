import type { SpecFn, Spec } from '../shared/spec-framework'
import type { Dispatch, DeliveryAttempt } from './types'

// ── Safe dep step: wraps deliver dep with DeliveryAttempt parsing ─────

export type SafeDeliverFailures = 'invalid_delivery_attempt'

export type SafeDeliverFn = SpecFn<
    Dispatch,
    DeliveryAttempt,
    SafeDeliverFailures,
    'delivery-successful' | 'delivery-failed'
>

export const safeDeliverSpec: Spec<SafeDeliverFn> = {
    shouldFailWith: {
        invalid_delivery_attempt: {
            description: 'Delivery attempt result fails DeliveryAttempt schema validation',
            examples: [],
        },
    },
    shouldSucceedWith: {
        'delivery-successful': {
            description: 'HTTP delivery succeeded and result is a valid DeliveryAttempt',
            examples: [],
        },
        'delivery-failed': {
            description: 'HTTP delivery failed and result is a valid DeliveryAttempt',
            examples: [],
        },
    },
    shouldAssert: {
        'delivery-successful': {},
        'delivery-failed': {},
    },
}
