// check-updatable-state.ts
import type { Result } from '../../../shared/spec'
import type { Mediation, DraftMediation, DeactivatedMediation } from '../../types'
import type { CheckUpdatableStateFailure, CheckUpdatableStateSuccess } from './check-updatable-state.spec'
import { checkUpdatableStateSpec } from './check-updatable-state.spec'

export const checkUpdatableState = (
  input: Mediation,
): Result<DraftMediation | DeactivatedMediation, CheckUpdatableStateFailure, CheckUpdatableStateSuccess> => {
  const errors: CheckUpdatableStateFailure[] = []

  for (const [failure, constraint] of Object.entries(checkUpdatableStateSpec.constraints)) {
    if (!constraint.predicate({ input })) errors.push(failure as CheckUpdatableStateFailure)
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, value: input as DraftMediation | DeactivatedMediation, successType: ['updatable-state-confirmed'] }
}
