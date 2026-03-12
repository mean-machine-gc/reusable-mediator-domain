import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { ResponseTimeMs, ResponseTimeMsFailure } from '../../types'

export type ParseResponseTimeMsFn = SpecFn<
    unknown,
    ResponseTimeMs,
    ResponseTimeMsFailure,
    'response-time-ms-parsed'
>

export const parseResponseTimeMsSpec: Spec<ParseResponseTimeMsFn> = {
    shouldFailWith: {
        not_a_number: {
            description: 'Input is not a number',
            examples: [
                { description: 'string input', whenInput: 'fast' },
                { description: 'null input', whenInput: null },
                { description: 'NaN', whenInput: NaN },
            ],
        },
        negative: {
            description: 'Input is negative',
            examples: [
                { description: 'negative number', whenInput: -50 },
            ],
        },
    },
    shouldSucceedWith: {
        'response-time-ms-parsed': {
            description: 'Input is a valid non-negative number',
            examples: [
                {
                    description: 'zero ms',
                    whenInput: 0,
                    then: 0,
                },
                {
                    description: '150.5 ms',
                    whenInput: 150.5,
                    then: 150.5,
                },
            ],
        },
    },
    shouldAssert: {
        'response-time-ms-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input number',
                assert: (input, output) => input === output,
            },
        },
    },
}
