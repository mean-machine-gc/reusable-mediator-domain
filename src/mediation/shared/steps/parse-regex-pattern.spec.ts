// parse-regex-pattern.spec.ts
import type { FunctionSpec } from '../../../shared/spec'
import type { RegexPattern, RegexPatternFailure } from '../../types'

export type ParseRegexPatternFailure = RegexPatternFailure
export type ParseRegexPatternSuccess = 'regex-pattern-parsed'

// ── Helpers ────────────────────────────────────────────────────────────────
const scriptPattern = /<script|javascript:|on\w+\s*=/i

const isValidRegex = (input: unknown): boolean => {
  if (typeof input !== 'string') return false
  try {
    new RegExp(input)
    return true
  } catch {
    return false
  }
}

// ── Test data ──────────────────────────────────────────────────────────────
const validPattern = '^patient-\\d+$' as RegexPattern

// ── Spec ───────────────────────────────────────────────────────────────────
export const parseRegexPatternSpec: FunctionSpec<
  unknown, RegexPattern, ParseRegexPatternFailure, ParseRegexPatternSuccess
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
    too_long_max_1024: {
      predicate: ({ input }) => typeof input !== 'string' || input.length <= 1024,
      examples: [{ when: 'a'.repeat(1025) }],
    },
    invalid_regex: {
      predicate: ({ input }) => isValidRegex(input),
      examples: [
        { when: '[invalid' },
        { when: '(unclosed' },
        { when: '*bad' },
      ],
    },
    script_injection: {
      predicate: ({ input }) => typeof input !== 'string' || !scriptPattern.test(input),
      examples: [{ when: '<script>alert(1)</script>' }, { when: 'javascript:void(0)' }],
    },
  },
  successes: {
    'regex-pattern-parsed': {
      condition: () => true,
      assertions: {
        'output-equals-input': ({ input, output }) => output === input,
        'output-is-valid-regex': ({ output }) => isValidRegex(output),
      },
      examples: [
        { when: validPattern, then: validPattern },
        { when: '.*', then: '.*' as RegexPattern },
        { when: '^[a-z]+$', then: '^[a-z]+$' as RegexPattern },
      ],
    },
  },
  mixed: [
    {
      description: 'script injection that is also an invalid regex',
      when: '<script>alert(1)</script>',
      failsWith: ['script_injection'],
    },
  ],
}
