// parse-destination.spec.ts
import type { FunctionSpec } from '../../../shared/spec'
import type { Destination, DestinationFailure } from '../../types'

export type ParseDestinationFailure = DestinationFailure
export type ParseDestinationSuccess = 'destination-parsed'

// ── Helpers ────────────────────────────────────────────────────────────────
const scriptPattern = /<script|javascript:|on\w+\s*=/i
const urlRegex = /^https?:\/\/.+/i

// ── Test data ──────────────────────────────────────────────────────────────
const validDestination = 'https://openhim.example.org/adapter/dhis2/patient' as Destination

// ── Spec ───────────────────────────────────────────────────────────────────
export const parseDestinationSpec: FunctionSpec<
  unknown, Destination, ParseDestinationFailure, ParseDestinationSuccess
> = {
  constraints: {
    not_a_string: {
      predicate: ({ input }) => typeof input === 'string',
      examples: [{ when: 42 }, { when: null }, { when: {} }],
    },
    empty: {
      predicate: ({ input }) => typeof input === 'string' && input.length > 0,
      examples: [{ when: '' }],
    },
    too_long_max_2048: {
      predicate: ({ input }) => typeof input !== 'string' || input.length <= 2048,
      examples: [{ when: 'https://example.com/' + 'a'.repeat(2040) }],
    },
    invalid_format_url: {
      predicate: ({ input }) => typeof input !== 'string' || urlRegex.test(input),
      examples: [
        { when: 'not-a-url' },
        { when: 'ftp://example.com/adapter' },
        { when: '/adapter/dhis2' },
      ],
    },
    script_injection: {
      predicate: ({ input }) => typeof input !== 'string' || !scriptPattern.test(input),
      examples: [{ when: 'https://example.com/<script>' }, { when: 'javascript:void(0)' }],
    },
  },
  successes: {
    'destination-parsed': {
      condition: () => true,
      assertions: {
        'output-equals-input': ({ input, output }) => output === input,
        'output-is-url': ({ output }) => urlRegex.test(output),
      },
      examples: [
        { when: validDestination, then: validDestination },
        { when: 'http://localhost:5001/adapter/fhir/patient', then: 'http://localhost:5001/adapter/fhir/patient' as Destination },
      ],
    },
  },
  mixed: [
    {
      description: 'script injection in url-like string',
      when: 'https://example.com/<script>alert(1)</script>',
      failsWith: ['script_injection'],
    },
    {
      description: 'javascript protocol injection',
      when: 'javascript:void(0)',
      failsWith: ['script_injection', 'invalid_format_url'],
    },
  ],
}
