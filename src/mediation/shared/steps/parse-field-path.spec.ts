// parse-field-path.spec.ts
import type { FunctionSpec } from '../../../shared/spec'
import type { FieldPath, FieldPathFailure } from '../../types'

export type ParseFieldPathFailure = FieldPathFailure
export type ParseFieldPathSuccess = 'field-path-parsed'

// ── Helpers ────────────────────────────────────────────────────────────────
const scriptPattern = /<script|javascript:|on\w+\s*=/i
const validCharsRegex = /^[a-zA-Z0-9\-_.]+$/
const dotSegmentRegex = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/

// ── Test data ──────────────────────────────────────────────────────────────
const validFieldPath = 'data.patient.status' as FieldPath

// ── Spec ───────────────────────────────────────────────────────────────────
export const parseFieldPathSpec: FunctionSpec<
  unknown, FieldPath, ParseFieldPathFailure, ParseFieldPathSuccess
> = {
  constraints: {
    not_a_string: {
      predicate: ({ input }) => typeof input === 'string',
      examples: [{ when: 42 }, { when: null }, { when: [] }],
    },
    empty: {
      predicate: ({ input }) => typeof input === 'string' && input.length > 0,
      examples: [{ when: '' }],
    },
    too_long_max_512: {
      predicate: ({ input }) => typeof input !== 'string' || input.length <= 512,
      examples: [{ when: 'a'.repeat(513) }],
    },
    invalid_format_dot_separated_segments: {
      predicate: ({ input }) => typeof input !== 'string' || dotSegmentRegex.test(input),
      examples: [
        { when: '.data' },
        { when: 'data.' },
        { when: 'data..status' },
        { when: '.' },
      ],
    },
    invalid_chars_alphanumeric_hyphens_underscores_and_dots_only: {
      predicate: ({ input }) => typeof input !== 'string' || validCharsRegex.test(input),
      examples: [
        { when: 'data/patient' },
        { when: 'data patient' },
        { when: 'data@patient' },
      ],
    },
    script_injection: {
      predicate: ({ input }) => typeof input !== 'string' || !scriptPattern.test(input),
      examples: [{ when: '<script>alert(1)</script>' }, { when: 'javascript:void(0)' }],
    },
  },
  successes: {
    'field-path-parsed': {
      condition: () => true,
      assertions: {
        'output-equals-input': ({ input, output }) => output === input,
        'output-has-valid-format': ({ output }) => dotSegmentRegex.test(output),
      },
      examples: [
        { when: validFieldPath, then: validFieldPath },
        { when: 'type', then: 'type' as FieldPath },
        { when: 'data.patient_name.first-name', then: 'data.patient_name.first-name' as FieldPath },
      ],
    },
  },
  mixed: [
    {
      description: 'script injection with invalid chars and format',
      when: '<script>alert(1)</script>',
      failsWith: [
        'script_injection',
        'invalid_chars_alphanumeric_hyphens_underscores_and_dots_only',
        'invalid_format_dot_separated_segments',
      ],
    },
  ],
}
