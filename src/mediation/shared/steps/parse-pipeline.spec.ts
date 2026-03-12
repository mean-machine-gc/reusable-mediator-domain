import type { SpecFn, Spec } from '../../../shared/spec-framework'
import type { Pipeline, PipelineFailure, FilterStep, TransformStep } from '../../types'

export type ParsePipelineFn = SpecFn<
    unknown,
    Pipeline,
    PipelineFailure,
    'pipeline-parsed'
>

const filterStep: FilterStep = {
    type: 'filter',
    rules: {
        logic: 'and',
        conditions: [{ field: 'data.type', operator: 'equals', value: 'patient' }],
    },
}

const transformStep: TransformStep = {
    type: 'transform',
    rules: ['uppercase'],
}

export const parsePipelineSpec: Spec<ParsePipelineFn> = {
    shouldFailWith: {
        not_an_array: {
            description: 'Input is not an array',
            examples: [
                { description: 'string input', whenInput: 'not-an-array' },
                { description: 'number input', whenInput: 42 },
                { description: 'null input', whenInput: null },
                { description: 'object input', whenInput: { steps: [] } },
            ],
        },
        empty: {
            description: 'Input is an empty array',
            examples: [
                { description: 'empty array', whenInput: [] },
            ],
        },
        invalid_step: {
            description: 'Input contains an invalid step',
            examples: [
                { description: 'step without type', whenInput: [{ rules: {} }] },
                { description: 'step with invalid type', whenInput: [{ type: 'unknown', rules: {} }] },
                { description: 'non-object step', whenInput: ['not-a-step'] },
            ],
        },
    },
    shouldSucceedWith: {
        'pipeline-parsed': {
            description: 'Input is a valid pipeline of steps',
            examples: [
                {
                    description: 'single filter step',
                    whenInput: [filterStep],
                    then: [filterStep],
                },
                {
                    description: 'single transform step',
                    whenInput: [transformStep],
                    then: [transformStep],
                },
                {
                    description: 'mixed pipeline',
                    whenInput: [filterStep, transformStep],
                    then: [filterStep, transformStep],
                },
            ],
        },
    },
    shouldAssert: {
        'pipeline-parsed': {
            'output-is-array': {
                description: 'Parsed value is an array',
                assert: (_input, output) => Array.isArray(output),
            },
        },
    },
}
