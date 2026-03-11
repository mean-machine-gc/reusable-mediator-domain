// parse-mediation-id.ts
import type { Result } from '../../../shared/spec'
import type { MediationId } from '../../types'
import type { ParseMediationIdFailure, ParseMediationIdSuccess } from './parse-mediation-id.spec'
import { parseMediationIdSpec } from './parse-mediation-id.spec'

export const parseMediationId = (input: unknown): Result<MediationId, ParseMediationIdFailure, ParseMediationIdSuccess> => {
  if (typeof input !== 'string')
    return { ok: false, errors: ['not_a_string'] }

  const errors: ParseMediationIdFailure[] = []

  for (const [failure, constraint] of Object.entries(parseMediationIdSpec.constraints)) {
    if (failure === 'not_a_string') continue
    if (!constraint.predicate({ input })) errors.push(failure as ParseMediationIdFailure)
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, value: input as MediationId, successType: ['mediation-id-parsed'] }
}
