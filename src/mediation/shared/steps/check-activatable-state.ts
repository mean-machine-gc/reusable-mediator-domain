// check-activatable-state.ts
import type { Result } from '../../../shared/spec'
import type { Mediation, DraftMediation, DeactivatedMediation } from '../../types'
import type { CheckActivatableStateFailure, CheckActivatableStateSuccess } from './check-activatable-state.spec'
import { checkActivatableStateSpec } from './check-activatable-state.spec'

export const checkActivatableState = (
  input: Mediation,
): Result<DraftMediation | DeactivatedMediation, CheckActivatableStateFailure, CheckActivatableStateSuccess> => {
  const errors: CheckActivatableStateFailure[] = []

  for (const [failure, constraint] of Object.entries(checkActivatableStateSpec.constraints)) {
    if (!constraint.predicate({ input })) errors.push(failure as CheckActivatableStateFailure)
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, value: input as DraftMediation | DeactivatedMediation, successType: ['activatable-state-confirmed'] }
}
