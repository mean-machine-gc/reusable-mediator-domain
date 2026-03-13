import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { ReceivedAt } from '../../types'
import { timestamps } from '../../fixtures'

export type ParseReceivedAtFailures = 'invalid_received_at'

export type ParseReceivedAtFn = SpecFn<
    unknown,
    ReceivedAt,
    ParseReceivedAtFailures,
    'received-at-parsed'
>

export const parseReceivedAtSpec: Spec<ParseReceivedAtFn> = {
    shouldFailWith: {
        invalid_received_at: {
            description: 'Input is not a valid received-at timestamp',
            examples: [
                { description: 'string input', whenInput: timestamps.invalid.string },
                { description: 'number input', whenInput: timestamps.invalid.number },
                { description: 'null input', whenInput: timestamps.invalid.null },
                { description: 'undefined input', whenInput: timestamps.invalid.undefined },
                { description: 'invalid date object', whenInput: timestamps.invalid.invalidDate },
            ],
        },
    },
    shouldSucceedWith: {
        'received-at-parsed': {
            description: 'Input is a valid Date instance',
            examples: [
                {
                    description: 'valid date',
                    whenInput: timestamps.valid.receivedAt,
                    then: timestamps.valid.receivedAt,
                },
            ],
        },
    },
    shouldAssert: {
        'received-at-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input date',
                assert: (input, output) => input instanceof Date && output.getTime() === input.getTime(),
            },
        },
    },
}
