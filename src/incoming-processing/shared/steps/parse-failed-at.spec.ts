import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { FailedAt, FailedAtFailure } from '../../types'

export type ParseFailedAtFn = SpecFn<
    unknown,
    FailedAt,
    FailedAtFailure,
    'failed-at-parsed'
>

export const parseFailedAtSpec: Spec<ParseFailedAtFn> = {
    shouldFailWith: {
        not_a_date: {
            description: 'Input is not a valid Date',
            examples: [
                { description: 'string input', whenInput: '2025-01-01' },
                { description: 'number input', whenInput: 1704067200000 },
                { description: 'null input', whenInput: null },
                { description: 'undefined input', whenInput: undefined },
                { description: 'invalid date object', whenInput: new Date('invalid') },
            ],
        },
    },
    shouldSucceedWith: {
        'failed-at-parsed': {
            description: 'Input is a valid Date instance',
            examples: [
                {
                    description: 'valid date',
                    whenInput: new Date('2025-06-15T10:45:00Z'),
                    then: new Date('2025-06-15T10:45:00Z'),
                },
            ],
        },
    },
    shouldAssert: {
        'failed-at-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input date',
                assert: (input, output) => input instanceof Date && output.getTime() === input.getTime(),
            },
        },
    },
}
