// parse-pipeline.spec.ts
import type { FunctionSpec } from '../../../shared/spec'
import type { Pipeline, PipelineFailure, FieldPath } from '../../types'

export type ParsePipelineFailure = PipelineFailure
export type ParsePipelineSuccess = 'pipeline-parsed'

// ── Test data ──────────────────────────────────────────────────────────────
const validPipeline: Pipeline = [
  {
    type: 'filter',
    rules: {
      logic: 'and',
      conditions: [
        { field: 'type' as FieldPath, operator: 'equals', value: 'patient-created' },
      ],
    },
  },
]

const multiStepPipeline: Pipeline = [
  {
    type: 'filter',
    rules: {
      logic: 'or',
      conditions: [
        { field: 'source' as FieldPath, operator: 'equals', value: 'ehr' },
      ],
    },
  },
  { type: 'transform', rules: {} },
]

// ── Spec ───────────────────────────────────────────────────────────────────
export const parsePipelineSpec: FunctionSpec<
  unknown, Pipeline, ParsePipelineFailure, ParsePipelineSuccess
> = {
  constraints: {
    not_an_array: {
      predicate: ({ input }) => Array.isArray(input),
      examples: [
        { when: 'not-an-array' },
        { when: 42 },
        { when: null },
        { when: {} },
      ],
    },
    empty: {
      predicate: ({ input }) => !Array.isArray(input) || input.length > 0,
      examples: [{ when: [] }],
    },
    invalid_step: {
      predicate: ({ input }) => {
        if (!Array.isArray(input)) return true
        return input.every(
          (step: any) =>
            step !== null &&
            typeof step === 'object' &&
            typeof step.type === 'string' &&
            ['filter', 'transform', 'enrich'].includes(step.type) &&
            'rules' in step
        )
      },
      examples: [
        { when: [{ type: 'unknown', rules: {} }] },
        { when: [{ rules: {} }] },
        { when: [null] },
        { when: [{ type: 'filter' }] },
      ],
    },
  },
  successes: {
    'pipeline-parsed': {
      condition: () => true,
      assertions: {
        'output-is-array': ({ output }) => Array.isArray(output),
        'output-preserves-steps': ({ input, output }) =>
          Array.isArray(input) && output.length === input.length,
      },
      examples: [
        { when: validPipeline, then: validPipeline },
        { when: multiStepPipeline, then: multiStepPipeline },
      ],
    },
  },
}
