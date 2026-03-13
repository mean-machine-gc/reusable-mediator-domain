import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { Destination, DestinationValidations } from '../../types'

export type ParseDestinationFn = SpecFn<
    unknown,
    Destination,
    DestinationValidations,
    'destination-parsed'
>

export const parseDestinationSpec: Spec<ParseDestinationFn> = {
    shouldFailWith: {
        not_a_string: {
            description: 'Input is not a string',
            examples: [
                { description: 'number input', whenInput: 42 },
                { description: 'null input', whenInput: null },
                { description: 'undefined input', whenInput: undefined },
                { description: 'object input', whenInput: { url: 'https://example.com' } },
            ],
        },
        empty: {
            description: 'Input is an empty string',
            examples: [
                { description: 'empty string', whenInput: '' },
            ],
        },
        too_long_max_2048: {
            description: 'Input exceeds 2048 characters',
            examples: [
                { description: 'string longer than 2048 chars', whenInput: 'https://example.com/' + 'a'.repeat(2030) },
            ],
        },
        invalid_format_url: {
            description: 'Input is not a valid URL',
            examples: [
                { description: 'plain text', whenInput: 'not-a-url' },
                { description: 'missing protocol', whenInput: 'example.com/api' },
                { description: 'ftp protocol', whenInput: 'ftp://example.com/file' },
            ],
        },
        script_injection: {
            description: 'Input contains script injection',
            examples: [
                { description: 'script tag', whenInput: '<script>alert("xss")</script>' },
                { description: 'javascript protocol', whenInput: 'javascript:alert(1)' },
            ],
        },
    },
    shouldSucceedWith: {
        'destination-parsed': {
            description: 'Input is a valid HTTP(S) URL destination',
            examples: [
                {
                    description: 'valid HTTPS URL',
                    whenInput: 'https://example.com/api/webhook',
                    then: 'https://example.com/api/webhook',
                },
                {
                    description: 'valid HTTP localhost URL',
                    whenInput: 'http://localhost:3000/callback',
                    then: 'http://localhost:3000/callback',
                },
            ],
        },
    },
    shouldAssert: {
        'destination-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input string',
                assert: (input, output) => input === output,
            },
        },
    },
}
