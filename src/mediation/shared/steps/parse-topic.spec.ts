// parse-topic.spec.ts
import type { FunctionSpec } from '../../../shared/spec'
import type { Topic, TopicFailure } from '../../types'

export type ParseTopicFailure = TopicFailure
export type ParseTopicSuccess = 'topic-parsed'

// ── Helpers ────────────────────────────────────────────────────────────────
const scriptPattern = /<script|javascript:|on\w+\s*=/i
const validCharsRegex = /^[a-zA-Z0-9\-.]+$/
const dotSegmentRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/

// ── Test data ──────────────────────────────────────────────────────────────
const validTopic = 'orders.order-created.v1' as Topic

// ── Spec ───────────────────────────────────────────────────────────────────
export const parseTopicSpec: FunctionSpec<
  unknown, Topic, ParseTopicFailure, ParseTopicSuccess
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
    too_short_min_2: {
      predicate: ({ input }) => typeof input !== 'string' || input.length >= 2,
      examples: [{ when: 'a' }],
    },
    too_long_max_256: {
      predicate: ({ input }) => typeof input !== 'string' || input.length <= 256,
      examples: [{ when: 'a'.repeat(257) }],
    },
    invalid_format_dot_separated_segments: {
      predicate: ({ input }) => typeof input !== 'string' || dotSegmentRegex.test(input),
      examples: [
        { when: '.orders' },
        { when: 'orders.' },
        { when: 'orders..created' },
        { when: '..' },
      ],
    },
    invalid_chars_alphanumeric_hyphens_and_dots_only: {
      predicate: ({ input }) => typeof input !== 'string' || validCharsRegex.test(input),
      examples: [
        { when: 'orders/created' },
        { when: 'orders created' },
        { when: 'orders_created' },
      ],
    },
    script_injection: {
      predicate: ({ input }) => typeof input !== 'string' || !scriptPattern.test(input),
      examples: [{ when: '<script>alert(1)</script>' }, { when: 'javascript:void(0)' }],
    },
  },
  successes: {
    'topic-parsed': {
      condition: () => true,
      assertions: {
        'output-equals-input': ({ input, output }) => output === input,
        'output-has-valid-format': ({ output }) => dotSegmentRegex.test(output),
      },
      examples: [
        { when: validTopic, then: validTopic },
        { when: 'patients.patient-registered.v2', then: 'patients.patient-registered.v2' as Topic },
        { when: 'ab', then: 'ab' as Topic },
      ],
    },
  },
  mixed: [
    {
      description: 'too short and invalid chars',
      when: '!',
      failsWith: ['too_short_min_2', 'invalid_chars_alphanumeric_hyphens_and_dots_only', 'invalid_format_dot_separated_segments'],
    },
    {
      description: 'script injection with invalid chars',
      when: '<script>alert(1)</script>',
      failsWith: ['script_injection', 'invalid_chars_alphanumeric_hyphens_and_dots_only', 'invalid_format_dot_separated_segments'],
    },
  ],
}
