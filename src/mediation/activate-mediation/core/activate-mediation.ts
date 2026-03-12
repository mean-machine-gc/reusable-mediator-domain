import type { ActivateMediationCoreFn } from './activate-mediation.spec'
import { checkActivatableState } from '../../shared/steps/check-activatable-state'
import { assembleActiveMediation } from '../../shared/steps/assemble-active-mediation'
import type { Mediation, ActiveMediation, ActivatedAt } from '../../types'

type CoreInput = { state: Mediation; ctx: { activatedAt: ActivatedAt } }
type CoreSuccess = 'draft-activated' | 'reactivated'

type CoreSteps = {
    checkActivatableState: typeof checkActivatableState
    assembleActiveMediation: typeof assembleActiveMediation
    evaluateSuccessType: (input: CoreInput, output: ActiveMediation) => CoreSuccess[]
}

const evaluateSuccessType = (input: CoreInput, _output: ActiveMediation): CoreSuccess[] => {
    if (input.state.status === 'draft') return ['draft-activated']
    return ['reactivated']
}

const activateMediationCoreFactory =
    (steps: CoreSteps): ActivateMediationCoreFn['signature'] =>
    (input) => {
        const checked = steps.checkActivatableState(input.state)
        if (!checked.ok) return checked as any

        const assembled = steps.assembleActiveMediation({ state: checked.value, ctx: input.ctx })
        if (!assembled.ok) return assembled as any

        const successType = steps.evaluateSuccessType(input, assembled.value)
        return { ok: true, value: assembled.value, successType }
    }

const coreSteps: CoreSteps = { checkActivatableState, assembleActiveMediation, evaluateSuccessType }
export const activateMediationCore = activateMediationCoreFactory(coreSteps)
