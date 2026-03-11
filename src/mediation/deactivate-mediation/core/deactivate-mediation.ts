// deactivate-mediation core factory
import type { Result } from '../../../shared/spec'
import type { Mediation, ActiveMediation, DeactivatedMediation, DeactivatedAt } from '../../types'
import type { CoreInput, CoreOutput, CoreFailure, CoreSuccess } from './deactivate-mediation.spec'
import { checkDeactivatableState } from '../../shared/steps/check-deactivatable-state'
import { assembleDeactivatedMediation } from '../../shared/steps/assemble-deactivated-mediation'

type CoreSteps = {
  checkDeactivatableState: (input: Mediation) => Result<ActiveMediation>
  assembleDeactivatedMediation: (input: {
    state: ActiveMediation
    ctx: { deactivatedAt: DeactivatedAt }
  }) => Result<DeactivatedMediation>
  evaluateSuccessType: (input: CoreInput, output: CoreOutput) => CoreSuccess[]
}

const evaluateSuccessType = (_input: CoreInput, _output: CoreOutput): CoreSuccess[] => {
  return ['mediation-deactivated']
}

export const coreSteps: CoreSteps = {
  checkDeactivatableState,
  assembleDeactivatedMediation,
  evaluateSuccessType,
}

export const deactivateMediationCoreFactory =
  (steps: CoreSteps) =>
  (input: CoreInput): Result<CoreOutput, CoreFailure, CoreSuccess> => {
    // 1. check deactivatable state (must be active)
    const checked = steps.checkDeactivatableState(input.state)
    if (!checked.ok) return checked as Result<CoreOutput, CoreFailure, CoreSuccess>

    // 2. assemble deactivated mediation
    const assembled = steps.assembleDeactivatedMediation({
      state: checked.value,
      ctx: input.ctx,
    })
    if (!assembled.ok) return assembled as Result<CoreOutput, CoreFailure, CoreSuccess>

    // 3. evaluate success type
    const successType = steps.evaluateSuccessType(input, assembled.value)

    return { ok: true, value: assembled.value, successType }
  }
