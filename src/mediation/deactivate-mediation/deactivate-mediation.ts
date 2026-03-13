import type { DeactivateMediationShellFn } from './deactivate-mediation.spec'
import type { DomainDeps } from '../../domain-deps'
import { parseMediationId } from '../shared/steps/parse-mediation-id'
import { deactivateMediationCore } from './core/deactivate-mediation'

type ShellSteps = {
    parseMediationId: typeof parseMediationId
    deactivateMediationCore: typeof deactivateMediationCore
}

type Deps = {
    getMediationById: DomainDeps['getMediationById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertMediation: DomainDeps['upsertMediation']
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

        const mediationResult = await deps.getMediationById(mediationId.value)
        if (mediationResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const deactivatedAtResult = await deps.generateTimestamp()

        const deactivated = steps.deactivateMediationCore({
            state: mediationResult.value!,
            ctx: { deactivatedAt: deactivatedAtResult.value },
        })
        if (!deactivated.ok) return deactivated as any

        await deps.upsertMediation(deactivated.value)

        return { ok: true, value: deactivated.value, successType: deactivated.successType }
    }

export const _deactivateMediation = deactivateMediationShellFactory(shellSteps)
