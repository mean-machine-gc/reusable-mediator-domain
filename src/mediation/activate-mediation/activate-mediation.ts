import type { ActivateMediationShellFn } from './activate-mediation.spec'
import type { Result } from '../../shared/spec-framework'
import type { MediationId, Mediation, ActiveMediation, ActivatedAt } from '../types'
import { parseMediationId } from '../shared/steps/parse-mediation-id'
import { activateMediationCore } from './core/activate-mediation'

type ShellSteps = {
    parseMediationId: typeof parseMediationId
    activateMediationCore: typeof activateMediationCore
}

type Deps = {
    findMediation: (id: MediationId) => Promise<Result<Mediation>>
    generateTimestamp: () => Promise<Result<ActivatedAt>>
    saveMediation: (mediation: ActiveMediation) => Promise<Result<ActiveMediation>>
}

export const shellSteps: ShellSteps = {
    parseMediationId,
    activateMediationCore,
}

const activateMediationShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): ActivateMediationShellFn['asyncSignature'] =>
    async (input) => {
        const mediationId = steps.parseMediationId(input.cmd.mediationId)
        if (!mediationId.ok) return mediationId as any

        const mediation = await deps.findMediation(mediationId.value)
        if (!mediation.ok) return mediation as any

        const timestamp = await deps.generateTimestamp()
        if (!timestamp.ok) return timestamp as any

        const activated = steps.activateMediationCore({
            state: mediation.value,
            ctx: { activatedAt: timestamp.value },
        })
        if (!activated.ok) return activated as any

        const saved = await deps.saveMediation(activated.value)
        if (!saved.ok) return saved as any

        return { ok: true, value: saved.value, successType: activated.successType }
    }

export const makeActivateMediation = activateMediationShellFactory(shellSteps)
