// parse-mediation-id.spec.ts
import type { FunctionSpec } from '../../../shared/spec'
import type { MediationId, MediationIdFailure } from '../../types'

export type ParseMediationIdFailure = MediationIdFailure
export type ParseMediationIdSuccess = 'mediation-id-parsed'

// ── Helpers ────────────────────────────────────────────────────────────────
const scriptPattern = /<script|javascript:|on\w+\s*=/i
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// ── Test data ──────────────────────────────────────────────────────────────
const validId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' as MediationId

// ── Spec ───────────────────────────────────────────────────────────────────
export const parseMediationIdSpec: FunctionSpec<
  unknown, MediationId, ParseMediationIdFailure, ParseMediationIdSuccess
> = {
  constraints: {
    not_a_string: {
      predicate: ({ input }) => typeof input === 'string',
      examples: [{ when: 42 }, { when: null }, { when: undefined }, { when: {} }],
    },
    empty: {
      predicate: ({ input }) => typeof input === 'string' && input.length > 0,
      examples: [{ when: '' }],
    },
    too_long_max_64: {
      predicate: ({ input }) => typeof input !== 'string' || input.length <= 64,
      examples: [{ when: 'a'.repeat(65) }],
    },
    not_a_uuid: {
      predicate: ({ input }) => typeof input === 'string' && uuidRegex.test(input),
      examples: [{ when: 'not-a-valid-uuid' }, { when: '12345678-1234-1234-1234' }],
    },
    script_injection: {
      predicate: ({ input }) => typeof input !== 'string' || !scriptPattern.test(input),
      examples: [{ when: '<script>alert("xss")</script>' }, { when: 'javascript:void(0)' }],
    },
  },
  successes: {
    'mediation-id-parsed': {
      condition: () => true,
      assertions: {
        'output-equals-input': ({ input, output }) => output === input,
        'output-is-uuid': ({ output }) => uuidRegex.test(output),
      },
      examples: [
        { when: validId, then: validId },
        { when: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', then: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' as MediationId },
      ],
    },
  },
  mixed: [
    {
      description: 'script injection that is also not a uuid',
      when: '<script>alert(1)</script>',
      failsWith: ['script_injection', 'not_a_uuid'],
    },
  ],
}
