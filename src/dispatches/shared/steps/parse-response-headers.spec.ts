import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { ResponseHeaders, ResponseHeadersValidations } from '../../types'

export type ParseResponseHeadersFn = SpecFn<
    unknown,
    ResponseHeaders,
    ResponseHeadersValidations,
    'response-headers-parsed'
>

export const parseResponseHeadersSpec: Spec<ParseResponseHeadersFn> = {
    shouldFailWith: {
        not_an_object: {
            description: 'Input is not an object',
            examples: [
                { description: 'string input', whenInput: 'content-type: json' },
                { description: 'number input', whenInput: 42 },
                { description: 'null input', whenInput: null },
                { description: 'array input', whenInput: ['content-type', 'json'] },
            ],
        },
    },
    shouldSucceedWith: {
        'response-headers-parsed': {
            description: 'Input is a valid headers object',
            examples: [
                {
                    description: 'typical response headers',
                    whenInput: { 'content-type': 'application/json', 'x-request-id': 'abc-123' },
                    then: { 'content-type': 'application/json', 'x-request-id': 'abc-123' },
                },
                {
                    description: 'empty headers',
                    whenInput: {},
                    then: {},
                },
            ],
        },
    },
    shouldAssert: {
        'response-headers-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input object',
                assert: (input, output) => JSON.stringify(input) === JSON.stringify(output),
            },
        },
    },
}
