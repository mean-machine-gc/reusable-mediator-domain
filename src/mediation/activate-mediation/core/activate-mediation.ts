// activate-mediation core factory
import type { Result } from '../../../shared/spec'
import type { Mediation, ActiveMediation, DraftMediation, DeactivatedMediation, ActivatedAt } from '../../types'
import type { CoreInput, CoreOutput, CoreFailure, CoreSuccess } from './activate-mediation.spec'
import { checkActivatableState } from '../../shared/steps/check-activatable-state'
import { assembleActiveMediation } from '../../shared/steps/assemble-active-mediation'
import { activateMediationCoreSpec } from './activate-mediation.spec'

type CoreSteps = {
  checkActivatableState: (input: Mediation) => Result<DraftMediation | DeactivatedMediation>
  assembleActiveMediation: (input: {
    state: DraftMediation | DeactivatedMediation
    ctx: { activatedAt: ActivatedAt }
  }) => Result<ActiveMediation>
  evaluateSuccessType: (input: CoreInput, output: CoreOutput) => CoreSuccess[]
}

const evaluateSuccessType = (input: CoreInput, output: CoreOutput): CoreSuccess[] => {
  const results: CoreSuccess[] = []
  for (const [successType, entry] of Object.entries(activateMediationCoreSpec.successes)) {
    if (entry.condition({ input, output })) results.push(successType as CoreSuccess)
  }
  return results
}

export const coreSteps: CoreSteps = {
  checkActivatableState,
  assembleActiveMediation,
  evaluateSuccessType,
}

export const activateMediationCoreFactory =
  (steps: CoreSteps) =>
  (input: CoreInput): Result<CoreOutput, CoreFailure, CoreSuccess> => {
    // 1. check activatable state (must be draft or deactivated)
    const checked = steps.checkActivatableState(input.state)
    if (!checked.ok) return checked as Result<CoreOutput, CoreFailure, CoreSuccess>

    // 2. assemble active mediation
    const assembled = steps.assembleActiveMediation({
      state: checked.value,
      ctx: input.ctx,
    })
    if (!assembled.ok) return assembled as Result<CoreOutput, CoreFailure, CoreSuccess>

    // 3. evaluate success type
    const successType = steps.evaluateSuccessType(input, assembled.value)

    return { ok: true, value: assembled.value, successType }
  }
