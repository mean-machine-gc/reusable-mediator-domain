// check-deactivatable-state.ts
import type { Result } from '../../../shared/spec'
import type { Mediation, ActiveMediation } from '../../types'
import type { CheckDeactivatableStateFailure, CheckDeactivatableStateSuccess } from './check-deactivatable-state.spec'
import { checkDeactivatableStateSpec } from './check-deactivatable-state.spec'

export const checkDeactivatableState = (
  input: Mediation,
): Result<ActiveMediation, CheckDeactivatableStateFailure, CheckDeactivatableStateSuccess> => {
  const errors: CheckDeactivatableStateFailure[] = []

  for (const [failure, constraint] of Object.entries(checkDeactivatableStateSpec.constraints)) {
    if (!constraint.predicate({ input })) errors.push(failure as CheckDeactivatableStateFailure)
  }

  if (errors.length > 0) return { ok: false, errors }
  return { ok: true, value: input as ActiveMediation, successType: ['deactivatable-state-confirmed'] }
}
