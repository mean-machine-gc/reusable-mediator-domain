import type { ActivateMediationShellFn } from './activate-mediation.spec'
import type { DomainDeps } from '../../domain-deps'
import { activateMediationCore } from './core/activate-mediation'

type ShellSteps = {
    activateMediationCore: typeof activateMediationCore
}

type Deps = {
    getMediationById: DomainDeps['getMediationById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertMediation: DomainDeps['upsertMediation']
}

const activateMediationShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): ActivateMediationShellFn['asyncSignature'] =>
    async (input) => {
        const mediationResult = await deps.getMediationById(input.cmd.mediationId)
        if (mediationResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const activatedAtResult = await deps.generateTimestamp()

        const activated = steps.activateMediationCore({
            state: mediationResult.value!,
            ctx: { activatedAt: activatedAtResult.value },
        })
        if (!activated.ok) return activated as any

        await deps.upsertMediation(activated.value)

        return { ok: true, value: activated.value, successType: activated.successType }
    }

export const _activateMediation = activateMediationShellFactory({
    activateMediationCore,
})
