import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { ResponseBody, ResponseBodyFailure } from '../../types'

export type ParseResponseBodyFn = SpecFn<
    unknown,
    ResponseBody,
    ResponseBodyFailure,
    'response-body-parsed'
>

export const parseResponseBodySpec: Spec<ParseResponseBodyFn> = {
    shouldFailWith: {
        not_a_string: {
            description: 'Input is not a string',
            examples: [
                { description: 'number input', whenInput: 42 },
                { description: 'null input', whenInput: null },
                { description: 'object input', whenInput: { body: 'ok' } },
            ],
        },
        too_long_max_65536: {
            description: 'Input exceeds 65536 characters',
            examples: [
                { description: 'string longer than 65536 chars', whenInput: 'a'.repeat(65537) },
            ],
        },
    },
    shouldSucceedWith: {
        'response-body-parsed': {
            description: 'Input is a valid response body string',
            examples: [
                {
                    description: 'empty body',
                    whenInput: '',
                    then: '',
                },
                {
                    description: 'JSON body',
                    whenInput: '{"status":"ok"}',
                    then: '{"status":"ok"}',
                },
            ],
        },
    },
    shouldAssert: {
        'response-body-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input string',
                assert: (input, output) => input === output,
            },
        },
    },
}
