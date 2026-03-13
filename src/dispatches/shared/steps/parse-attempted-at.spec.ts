import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { AttemptedAt, AttemptedAtValidations } from '../../types'

export type ParseAttemptedAtFn = SpecFn<
    unknown,
    AttemptedAt,
    AttemptedAtValidations,
    'attempted-at-parsed'
>

export const parseAttemptedAtSpec: Spec<ParseAttemptedAtFn> = {
    shouldFailWith: {
        not_a_date: {
            description: 'Input is not a valid Date',
            examples: [
                { description: 'string input', whenInput: '2025-01-01' },
                { description: 'number input', whenInput: 1704067200000 },
                { description: 'null input', whenInput: null },
                { description: 'invalid date object', whenInput: new Date('invalid') },
            ],
        },
    },
    shouldSucceedWith: {
        'attempted-at-parsed': {
            description: 'Input is a valid Date instance',
            examples: [
                {
                    description: 'valid date',
                    whenInput: new Date('2025-06-15T10:30:03Z'),
                    then: new Date('2025-06-15T10:30:03Z'),
                },
            ],
        },
    },
    shouldAssert: {
        'attempted-at-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input date',
                assert: (input, output) => input instanceof Date && output.getTime() === input.getTime(),
            },
        },
    },
}
