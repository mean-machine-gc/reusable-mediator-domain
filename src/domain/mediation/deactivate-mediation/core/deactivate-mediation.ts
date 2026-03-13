import type { DeactivateMediationCoreFn } from './deactivate-mediation.spec'
import { checkDeactivatableState } from '../../shared/steps/check-deactivatable-state'
import { assembleDeactivatedMediation } from '../../shared/steps/assemble-deactivated-mediation'
import type { Mediation, DeactivatedMediation, DeactivatedAt } from '../../types'

type CoreInput = { state: Mediation; ctx: { deactivatedAt: DeactivatedAt } }

type CoreSteps = {
    checkDeactivatableState: typeof checkDeactivatableState
    assembleDeactivatedMediation: typeof assembleDeactivatedMediation
    evaluateSuccessType: (input: CoreInput, output: DeactivatedMediation) => ('mediation-deactivated')[]
}

const evaluateSuccessType = (_input: CoreInput, _output: DeactivatedMediation): ('mediation-deactivated')[] => {
    return ['mediation-deactivated']
}

const deactivateMediationCoreFactory =
    (steps: CoreSteps): DeactivateMediationCoreFn['signature'] =>
    (input) => {
        const checked = steps.checkDeactivatableState(input.state)
        if (!checked.ok) return checked as any

        const assembled = steps.assembleDeactivatedMediation({ state: checked.value, ctx: input.ctx })
        if (!assembled.ok) return assembled as any

        const successType = steps.evaluateSuccessType(input, assembled.value)
        return { ok: true, value: assembled.value, successType }
    }

const coreSteps: CoreSteps = { checkDeactivatableState, assembleDeactivatedMediation, evaluateSuccessType }
export const deactivateMediationCore = deactivateMediationCoreFactory(coreSteps)
