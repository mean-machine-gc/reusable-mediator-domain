// parse-regex-pattern.ts
import type { Result } from '../../../shared/spec'
import type { RegexPattern } from '../../types'
import type { ParseRegexPatternFailure, ParseRegexPatternSuccess } from './parse-regex-pattern.spec'
import { parseRegexPatternSpec } from './parse-regex-pattern.spec'

export const parseRegexPattern = (input: unknown): Result<RegexPattern, ParseRegexPatternFailure, ParseRegexPatternSuccess> => {
  if (typeof input !== 'string')
    return { ok: false, errors: ['not_a_string'] }

  const errors: ParseRegexPatternFailure[] = []

  for (const [failure, constraint] of Object.entries(parseRegexPatternSpec.constraints)) {
    if (failure === 'not_a_string') continue
    if (!constraint.predicate({ input })) errors.push(failure as ParseRegexPatternFailure)
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, value: input as RegexPattern, successType: ['regex-pattern-parsed'] }
}
