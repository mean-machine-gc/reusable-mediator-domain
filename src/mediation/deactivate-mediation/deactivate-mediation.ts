import type { DeactivateMediationShellFn } from './deactivate-mediation.spec'
import type { Result } from '../../shared/spec-framework'
import type { MediationId, Mediation, DeactivatedMediation, DeactivatedAt } from '../types'
import { parseMediationId } from '../shared/steps/parse-mediation-id'
import { deactivateMediationCore } from './core/deactivate-mediation'

type ShellSteps = {
    parseMediationId: typeof parseMediationId
    deactivateMediationCore: typeof deactivateMediationCore
}

type Deps = {
    findMediation: (id: MediationId) => Promise<Result<Mediation>>
    generateTimestamp: () => Promise<Result<DeactivatedAt>>
    saveMediation: (mediation: DeactivatedMediation) => Promise<Result<DeactivatedMediation>>
}

export const shellSteps: ShellSteps = {
    parseMediationId,
    deactivateMediationCore,
}

const deactivateMediationShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): DeactivateMediationShellFn['asyncSignature'] =>
    async (input) => {
        const mediationId = steps.parseMediationId(input.cmd.mediationId)
        if (!mediationId.ok) return mediationId as any

        const mediation = await deps.findMediation(mediationId.value)
        if (!mediation.ok) return mediation as any

        const timestamp = await deps.generateTimestamp()
        if (!timestamp.ok) return timestamp as any

        const deactivated = steps.deactivateMediationCore({
            state: mediation.value,
            ctx: { deactivatedAt: timestamp.value },
        })
        if (!deactivated.ok) return deactivated as any

        const saved = await deps.saveMediation(deactivated.value)
        if (!saved.ok) return saved as any

        return { ok: true, value: saved.value, successType: deactivated.successType }
    }

export const makeDeactivateMediation = deactivateMediationShellFactory(shellSteps)
