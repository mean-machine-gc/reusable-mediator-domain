import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { CreatedAt, CreatedAtFailure } from '../../types'

export type ParseCreatedAtFn = SpecFn<
    unknown,
    CreatedAt,
    CreatedAtFailure,
    'created-at-parsed'
>

export const parseCreatedAtSpec: Spec<ParseCreatedAtFn> = {
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
        'created-at-parsed': {
            description: 'Input is a valid Date instance',
            examples: [
                {
                    description: 'valid date',
                    whenInput: new Date('2025-06-15T10:30:00Z'),
                    then: new Date('2025-06-15T10:30:00Z'),
                },
            ],
        },
    },
    shouldAssert: {
        'created-at-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input date',
                assert: (input, output) => input instanceof Date && output.getTime() === input.getTime(),
            },
        },
    },
}
