import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { ProcessingFailureReason, ProcessingFailureReasonFailure } from '../../types'

export type ParseProcessingFailureReasonFn = SpecFn<
    unknown,
    ProcessingFailureReason,
    ProcessingFailureReasonFailure,
    'processing-failure-reason-parsed'
>

export const parseProcessingFailureReasonSpec: Spec<ParseProcessingFailureReasonFn> = {
    shouldFailWith: {
        not_a_string: {
            description: 'Input is not a string',
            examples: [
                { description: 'number input', whenInput: 42 },
                { description: 'null input', whenInput: null },
                { description: 'undefined input', whenInput: undefined },
                { description: 'object input', whenInput: { reason: 'failed' } },
            ],
        },
        empty: {
            description: 'Input is an empty string',
            examples: [
                { description: 'empty string', whenInput: '' },
            ],
        },
        too_long_max_4096: {
            description: 'Input exceeds 4096 characters',
            examples: [
                { description: 'string longer than 4096 chars', whenInput: 'a'.repeat(4097) },
            ],
        },
    },
    shouldSucceedWith: {
        'processing-failure-reason-parsed': {
            description: 'Input is a valid failure reason string',
            examples: [
                {
                    description: 'short reason',
                    whenInput: 'schema_validation_failed',
                    then: 'schema_validation_failed',
                },
                {
                    description: 'descriptive reason',
                    whenInput: 'Event data does not conform to the resolved JSON Schema for patient-created/v1',
                    then: 'Event data does not conform to the resolved JSON Schema for patient-created/v1',
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
