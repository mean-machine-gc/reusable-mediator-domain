// parse-field-path.ts
import type { Result } from '../../../shared/spec'
import type { FieldPath } from '../../types'
import type { ParseFieldPathFailure, ParseFieldPathSuccess } from './parse-field-path.spec'
import { parseFieldPathSpec } from './parse-field-path.spec'

export const parseFieldPath = (input: unknown): Result<FieldPath, ParseFieldPathFailure, ParseFieldPathSuccess> => {
  if (typeof input !== 'string')
    return { ok: false, errors: ['not_a_string'] }

  const errors: ParseFieldPathFailure[] = []

  for (const [failure, constraint] of Object.entries(parseFieldPathSpec.constraints)) {
    if (failure === 'not_a_string') continue
    if (!constraint.predicate({ input })) errors.push(failure as ParseFieldPathFailure)
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, value: input as FieldPath, successType: ['field-path-parsed'] }
}
