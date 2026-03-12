import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { ProcessingId, ProcessingIdFailure } from '../../types'

export type ParseProcessingIdFn = SpecFn<
    unknown,
    ProcessingId,
    ProcessingIdFailure,
    'processing-id-parsed'
>

export const parseProcessingIdSpec: Spec<ParseProcessingIdFn> = {
    shouldFailWith: {
        not_a_string: {
            description: 'Input is not a string',
            examples: [
                { description: 'number input', whenInput: 42 },
                { description: 'null input', whenInput: null },
                { description: 'undefined input', whenInput: undefined },
                { description: 'object input', whenInput: { id: 'abc' } },
            ],
        },
        empty: {
            description: 'Input is an empty string',
            examples: [
                { description: 'empty string', whenInput: '' },
            ],
        },
        too_long_max_64: {
            description: 'Input exceeds 64 characters',
            examples: [
                { description: 'string longer than 64 chars', whenInput: 'a'.repeat(65) },
            ],
        },
        not_a_uuid: {
            description: 'Input is not a valid UUID',
            examples: [
                { description: 'plain text', whenInput: 'not-a-uuid' },
                { description: 'partial UUID', whenInput: '550e8400-e29b-41d4' },
            ],
        },
        script_injection: {
            description: 'Input contains script injection',
            examples: [
                { description: 'script tag', whenInput: '<script>alert("xss")</script>' },
                { description: 'javascript protocol', whenInput: 'javascript:alert(1)' },
                { description: 'event handler', whenInput: 'onclick=alert(1)' },
            ],
        },
    },
    shouldSucceedWith: {
        'processing-id-parsed': {
            description: 'Input is a valid UUID processing ID',
            examples: [
                {
                    description: 'valid UUID v4',
                    whenInput: '550e8400-e29b-41d4-a716-446655440000',
                    then: '550e8400-e29b-41d4-a716-446655440000',
                },
                {
                    description: 'another valid UUID',
                    whenInput: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
                    then: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
                },
            ],
        },
    },
    shouldAssert: {
        'processing-id-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input string',
                assert: (input, output) => input === output,
            },
        },
    },
}
