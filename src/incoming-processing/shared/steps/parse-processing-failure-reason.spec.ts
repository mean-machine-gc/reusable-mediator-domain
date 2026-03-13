import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { ProcessingFailureReason } from '../../types'
import { processingFailureReason as f } from '../../fixtures'

export type ParseProcessingFailureReasonFailures = 'invalid_processing_failure_reason'

export type ParseProcessingFailureReasonFn = SpecFn<
    unknown,
    ProcessingFailureReason,
    ParseProcessingFailureReasonFailures,
    'processing-failure-reason-parsed'
>

export const parseProcessingFailureReasonSpec: Spec<ParseProcessingFailureReasonFn> = {
    shouldFailWith: {
        invalid_processing_failure_reason: {
            description: 'Input fails TypeBox validation (not a string, empty, too long)',
            examples: [
                { description: 'number input', whenInput: f.invalid.number },
                { description: 'null input', whenInput: f.invalid.null },
                { description: 'undefined input', whenInput: f.invalid.undefined },
                { description: 'object input', whenInput: f.invalid.object },
                { description: 'empty string', whenInput: f.invalid.empty },
                { description: 'string longer than 4096 chars', whenInput: f.invalid.tooLong },
            ],
        },
    },
    shouldSucceedWith: {
        'processing-failure-reason-parsed': {
            description: 'Input is a valid failure reason string',
            examples: [
                {
                    description: 'short reason',
                    whenInput: f.valid.short,
                    then: f.valid.short,
                },
                {
                    description: 'descriptive reason',
                    whenInput: f.valid.descriptive,
                    then: f.valid.descriptive,
                },
            ],
        },
    },
    shouldAssert: {
        'processing-failure-reason-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input string',
                assert: (input, output) => input === output,
            },
        },
    },
}
