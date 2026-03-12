import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { DataschemaUri, DataschemaUriFailure } from '../../types'

export type ParseDataschemaUriFn = SpecFn<
    unknown,
    DataschemaUri,
    DataschemaUriFailure,
    'dataschema-uri-parsed'
>

export const parseDataschemaUriSpec: Spec<ParseDataschemaUriFn> = {
    shouldFailWith: {
        not_a_string: {
            description: 'Input is not a string',
            examples: [
                { description: 'number input', whenInput: 42 },
                { description: 'null input', whenInput: null },
                { description: 'undefined input', whenInput: undefined },
                { description: 'object input', whenInput: { uri: 'https://example.com' } },
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
                { description: 'string longer than 2048 chars', whenInput: 'https://registry.example.com/' + 'a'.repeat(2020) },
            ],
        },
        invalid_format_url: {
            description: 'Input is not a valid URL',
            examples: [
                { description: 'plain text', whenInput: 'not-a-url' },
                { description: 'missing protocol', whenInput: 'registry.example.com/schemas/v1' },
                { description: 'ftp protocol', whenInput: 'ftp://registry.example.com/schemas/v1' },
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
        'dataschema-uri-parsed': {
            description: 'Input is a valid HTTP(S) schema registry URL',
            examples: [
                {
                    description: 'valid HTTPS schema URL',
                    whenInput: 'https://registry.example.com/schemas/patient-created/v1',
                    then: 'https://registry.example.com/schemas/patient-created/v1',
                },
                {
                    description: 'valid HTTP localhost schema URL',
                    whenInput: 'http://localhost:8080/schemas/observation/v2',
                    then: 'http://localhost:8080/schemas/observation/v2',
                },
            ],
        },
    },
    shouldAssert: {
        'dataschema-uri-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input string',
                assert: (input, output) => input === output,
            },
        },
    },
}
