import type { SpecFn, Spec } from './spec-framework'
import type { Timestamp, TimestampValidations } from './primitives'

export type ParseTimestampFn = SpecFn<
    unknown,
    Timestamp,
    TimestampValidations,
    'timestamp-parsed'
>

export const parseTimestampSpec: Spec<ParseTimestampFn> = {
    shouldFailWith: {
        not_a_date: {
            description: 'Input is not a valid Date',
            examples: [
                { description: 'string input', whenInput: '2025-01-01' },
                { description: 'number input', whenInput: 1704067200000 },
                { description: 'null input', whenInput: null },
                { description: 'undefined input', whenInput: undefined },
                { description: 'invalid date object', whenInput: new Date('invalid') },
                { description: 'object input', whenInput: { date: '2025-01-01' } },
            ],
        },
    },
    shouldSucceedWith: {
        'timestamp-parsed': {
            description: 'Input is a valid Date instance',
            examples: [
                {
                    description: 'valid date',
                    whenInput: new Date('2025-06-15T10:30:00Z'),
                    then: new Date('2025-06-15T10:30:00Z'),
                },
                {
                    description: 'epoch date',
                    whenInput: new Date(0),
                    then: new Date(0),
                },
            ],
        },
    },
    shouldAssert: {
        'timestamp-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input date',
                assert: (input, output) =>
                    input instanceof Date && output.getTime() === input.getTime(),
            },
        },
    },
}
