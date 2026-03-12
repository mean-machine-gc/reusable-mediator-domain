import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { AttemptCount, AttemptCountFailure } from '../../types'

export type ParseAttemptCountFn = SpecFn<
    unknown,
    AttemptCount,
    AttemptCountFailure,
    'attempt-count-parsed'
>

export const parseAttemptCountSpec: Spec<ParseAttemptCountFn> = {
    shouldFailWith: {
        not_a_number: {
            description: 'Input is not a number',
            examples: [
                { description: 'string input', whenInput: 'three' },
                { description: 'null input', whenInput: null },
                { description: 'undefined input', whenInput: undefined },
                { description: 'NaN', whenInput: NaN },
            ],
        },
        not_an_integer: {
            description: 'Input is not an integer',
            examples: [
                { description: 'float value', whenInput: 2.5 },
            ],
        },
        negative: {
            description: 'Input is negative',
            examples: [
                { description: 'negative number', whenInput: -1 },
            ],
        },
    },
    shouldSucceedWith: {
        'attempt-count-parsed': {
            description: 'Input is a valid non-negative integer',
            examples: [
                {
                    description: 'zero attempts',
                    whenInput: 0,
                    then: 0,
                },
                {
                    description: 'three attempts',
                    whenInput: 3,
                    then: 3,
                },
            ],
        },
    },
    shouldAssert: {
        'attempt-count-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input number',
                assert: (input, output) => input === output,
            },
        },
    },
}
