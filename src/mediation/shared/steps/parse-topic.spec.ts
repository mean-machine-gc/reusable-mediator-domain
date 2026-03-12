import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { Topic, TopicFailure } from '../../types'

export type ParseTopicFn = SpecFn<
    unknown,
    Topic,
    TopicFailure,
    'topic-parsed'
>

export const parseTopicSpec: Spec<ParseTopicFn> = {
    shouldFailWith: {
        not_a_string: {
            description: 'Input is not a string',
            examples: [
                { description: 'number input', whenInput: 123 },
                { description: 'null input', whenInput: null },
                { description: 'undefined input', whenInput: undefined },
                { description: 'object input', whenInput: { topic: 'test' } },
            ],
        },
        empty: {
            description: 'Input is an empty string',
            examples: [
                { description: 'empty string', whenInput: '' },
            ],
        },
        too_short_min_2: {
            description: 'Input is shorter than 2 characters',
            examples: [
                { description: 'single character', whenInput: 'a' },
            ],
        },
        too_long_max_256: {
            description: 'Input exceeds 256 characters',
            examples: [
                { description: 'string longer than 256 chars', whenInput: 'a'.repeat(257) },
            ],
        },
        invalid_format_dot_separated_segments: {
            description: 'Input is not dot-separated segments',
            examples: [
                { description: 'trailing dot', whenInput: 'patient.' },
                { description: 'leading dot', whenInput: '.patient' },
                { description: 'consecutive dots', whenInput: 'patient..created' },
            ],
        },
        invalid_chars_alphanumeric_hyphens_and_dots_only: {
            description: 'Input contains invalid characters',
            examples: [
                { description: 'contains spaces', whenInput: 'patient created' },
                { description: 'contains underscores', whenInput: 'patient_created' },
                { description: 'contains special chars', whenInput: 'patient@created' },
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
        'topic-parsed': {
            description: 'Input is a valid dot-separated topic',
            examples: [
                {
                    description: 'standard dot-separated topic',
                    whenInput: 'patient.created',
                    then: 'patient.created',
                },
                {
                    description: 'topic with hyphens',
                    whenInput: 'org.facility-registry.update',
                    then: 'org.facility-registry.update',
                },
            ],
        },
    },
    shouldAssert: {
        'topic-parsed': {
            'output-equals-input': {
                description: 'Parsed value equals the input string',
                assert: (input, output) => input === output,
            },
        },
    },
}
