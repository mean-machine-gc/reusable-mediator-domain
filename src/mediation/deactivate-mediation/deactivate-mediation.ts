import type { DeactivateMediationShellFn } from './deactivate-mediation.spec'
import type { DomainDeps } from '../../domain-deps'
import { deactivateMediationCore } from './core/deactivate-mediation'

type ShellSteps = {
    deactivateMediationCore: typeof deactivateMediationCore
}

type Deps = {
    getMediationById: DomainDeps['getMediationById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertMediation: DomainDeps['upsertMediation']
}

const deactivateMediationShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): DeactivateMediationShellFn['asyncSignature'] =>
    async (input) => {
        const mediationResult = await deps.getMediationById(input.cmd.mediationId)
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

export const _deactivateMediation = deactivateMediationShellFactory({
    deactivateMediationCore,
})
