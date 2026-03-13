import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { DataschemaUri } from '../../types'
import { dataschemaUri as f } from '../../fixtures'

export type ParseDataschemaUriFailures = 'invalid_dataschema_uri' | 'invalid_format_url' | 'script_injection'

export type ParseDataschemaUriFn = SpecFn<
    unknown,
    DataschemaUri,
    ParseDataschemaUriFailures,
    'dataschema-uri-parsed'
>

export const parseDataschemaUriSpec: Spec<ParseDataschemaUriFn> = {
    shouldFailWith: {
        invalid_dataschema_uri: {
            description: 'Input fails TypeBox validation (not a string, empty, too long)',
            examples: [
                { description: 'number input', whenInput: f.invalid.number },
                { description: 'null input', whenInput: f.invalid.null },
                { description: 'undefined input', whenInput: f.invalid.undefined },
                { description: 'object input', whenInput: f.invalid.object },
                { description: 'empty string', whenInput: f.invalid.empty },
                { description: 'string longer than 2048 chars', whenInput: f.invalid.tooLong },
            ],
        },
        invalid_format_url: {
            description: 'Input is not a valid HTTP(S) URL',
            examples: [
                { description: 'plain text', whenInput: f.invalidUrl.plainText },
                { description: 'missing protocol', whenInput: f.invalidUrl.missingProtocol },
                { description: 'ftp protocol', whenInput: f.invalidUrl.ftpProtocol },
            ],
        },
        script_injection: {
            description: 'Input contains script injection patterns',
            examples: [
                { description: 'script tag', whenInput: f.injection.scriptTag },
                { description: 'javascript protocol', whenInput: f.injection.javascriptProtocol },
            ],
        },
    },
    shouldSucceedWith: {
        'dataschema-uri-parsed': {
            description: 'Input is a valid HTTP(S) schema registry URL',
            examples: [
                {
                    description: 'valid HTTPS schema URL',
                    whenInput: f.valid.https,
                    then: f.valid.https,
                },
                {
                    description: 'valid HTTP localhost schema URL',
                    whenInput: f.valid.localhost,
                    then: f.valid.localhost,
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
