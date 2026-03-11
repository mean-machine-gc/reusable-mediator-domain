// check-deletable-state.ts
import type { Result } from '../../../shared/spec'
import type { Mediation, DraftMediation, DeactivatedMediation } from '../../types'
import type { CheckDeletableStateFailure, CheckDeletableStateSuccess } from './check-deletable-state.spec'
import { checkDeletableStateSpec } from './check-deletable-state.spec'

export const checkDeletableState = (
  input: Mediation,
): Result<DraftMediation | DeactivatedMediation, CheckDeletableStateFailure, CheckDeletableStateSuccess> => {
  const errors: CheckDeletableStateFailure[] = []

  for (const [failure, constraint] of Object.entries(checkDeletableStateSpec.constraints)) {
    if (!constraint.predicate({ input })) errors.push(failure as CheckDeletableStateFailure)
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, value: input as DraftMediation | DeactivatedMediation, successType: ['deletable-state-confirmed'] }
}
