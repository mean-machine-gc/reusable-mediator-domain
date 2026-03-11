// delete-mediation core factory
import type { Result } from '../../../shared/spec'
import type { Mediation, DraftMediation, DeactivatedMediation } from '../../types'
import type { CoreInput, CoreOutput, CoreFailure, CoreSuccess } from './delete-mediation.spec'
import { checkDeletableState } from '../../shared/steps/check-deletable-state'

type CoreSteps = {
  checkDeletableState: (input: Mediation) => Result<DraftMediation | DeactivatedMediation>
}

export const coreSteps: CoreSteps = {
  checkDeletableState,
}

export const deleteMediationCoreFactory =
  (steps: CoreSteps) =>
  (input: CoreInput): Result<CoreOutput, CoreFailure, CoreSuccess> => {
    // 1. check deletable state (must be draft or deactivated)
    const checked = steps.checkDeletableState(input.state)
    if (!checked.ok) return checked as Result<CoreOutput, CoreFailure, CoreSuccess>

    return { ok: true, value: checked.value, successType: ['mediation-deleted'] }
  }
