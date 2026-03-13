import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { ProcessingId } from '../../types'
import { processingId as f } from '../../fixtures'

export type ParseProcessingIdFailures = 'invalid_processing_id' | 'script_injection'

export type ParseProcessingIdFn = SpecFn<
    unknown,
    ProcessingId,
    ParseProcessingIdFailures,
    'processing-id-parsed'
>

export const parseProcessingIdSpec: Spec<ParseProcessingIdFn> = {
    shouldFailWith: {
        invalid_processing_id: {
            description: 'Input fails TypeBox validation (not a string, empty, too long, not a UUID)',
            examples: [
                { description: 'number input', whenInput: f.invalid.number },
                { description: 'null input', whenInput: f.invalid.null },
                { description: 'undefined input', whenInput: f.invalid.undefined },
                { description: 'object input', whenInput: f.invalid.object },
                { description: 'empty string', whenInput: f.invalid.empty },
                { description: 'string longer than 64 chars', whenInput: f.invalid.tooLong },
                { description: 'not a uuid', whenInput: f.invalid.notUuid },
                { description: 'partial UUID', whenInput: f.invalid.partialUuid },
            ],
        },
        script_injection: {
            description: 'Input contains script injection patterns',
            examples: [
                { description: 'script tag', whenInput: f.injection.scriptTag },
                { description: 'javascript protocol', whenInput: f.injection.javascriptProtocol },
                { description: 'event handler', whenInput: f.injection.eventHandler },
            ],
        },
    },
    shouldSucceedWith: {
        'processing-id-parsed': {
            description: 'Input is a valid UUID processing ID',
            examples: [
                {
                    description: 'valid UUID v4',
                    whenInput: f.valid.uuid,
                    then: f.valid.uuid,
                },
                {
                    description: 'another valid UUID',
                    whenInput: f.valid.anotherUuid,
                    then: f.valid.anotherUuid,
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
