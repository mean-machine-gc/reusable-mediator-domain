import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { StatusCode, StatusCodeFailure } from '../../types'

export type ParseStatusCodeFn = SpecFn<
    unknown,
    StatusCode,
    StatusCodeFailure,
    'status-code-parsed'
>

export const parseStatusCodeSpec: Spec<ParseStatusCodeFn> = {
    shouldFailWith: {
        not_a_number: {
            description: 'Input is not a number',
            examples: [
                { description: 'string input', whenInput: '200' },
                { description: 'null input', whenInput: null },
                { description: 'NaN', whenInput: NaN },
            ],
        },
        not_an_integer: {
            description: 'Input is not an integer',
            examples: [
                { description: 'float value', whenInput: 200.5 },
            ],
        },
        out_of_range_min_100_max_599: {
            description: 'Input is outside the valid HTTP status code range',
            examples: [
                { description: 'below 100', whenInput: 99 },
                { description: 'above 599', whenInput: 600 },
            ],
        },
    },
    shouldSucceedWith: {
        'status-code-parsed': {
            description: 'Input is a valid HTTP status code',
            examples: [
                {
                    description: '200 OK',
                    whenInput: 200,
                    then: 200,
                },
                {
                    description: '503 Service Unavailable',
                    whenInput: 503,
                    then: 503,
                },
            ],
        },
    },
    shouldAssert: {
        'status-code-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input number',
                assert: (input, output) => input === output,
            },
        },
    },
}
