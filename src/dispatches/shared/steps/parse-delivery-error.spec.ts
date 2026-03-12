import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { DeliveryError, DeliveryErrorFailure } from '../../types'

export type ParseDeliveryErrorFn = SpecFn<
    unknown,
    DeliveryError,
    DeliveryErrorFailure,
    'delivery-error-parsed'
>

export const parseDeliveryErrorSpec: Spec<ParseDeliveryErrorFn> = {
    shouldFailWith: {
        not_a_string: {
            description: 'Input is not a string',
            examples: [
                { description: 'number input', whenInput: 42 },
                { description: 'null input', whenInput: null },
                { description: 'object input', whenInput: { error: 'timeout' } },
            ],
        },
        empty: {
            description: 'Input is an empty string',
            examples: [
                { description: 'empty string', whenInput: '' },
            ],
        },
        too_long_max_4096: {
            description: 'Input exceeds 4096 characters',
            examples: [
                { description: 'string longer than 4096 chars', whenInput: 'a'.repeat(4097) },
            ],
        },
    },
    shouldSucceedWith: {
        'delivery-error-parsed': {
            description: 'Input is a valid delivery error string',
            examples: [
                {
                    description: 'timeout error',
                    whenInput: 'ETIMEDOUT: connection timed out',
                    then: 'ETIMEDOUT: connection timed out',
                },
                {
                    description: 'connection refused',
                    whenInput: 'ECONNREFUSED: connection refused',
                    then: 'ECONNREFUSED: connection refused',
                },
            ],
        },
    },
    shouldAssert: {
        'delivery-error-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input string',
                assert: (input, output) => input === output,
            },
        },
    },
}
