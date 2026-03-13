import type { ActivateMediationShellFn } from './activate-mediation.spec'
import type { DomainDeps } from '../../domain-deps'
import { parseMediationId } from '../shared/steps/parse-mediation-id'
import { activateMediationCore } from './core/activate-mediation'

type ShellSteps = {
    parseMediationId: typeof parseMediationId
    activateMediationCore: typeof activateMediationCore
}

type Deps = {
    getMediationById: DomainDeps['getMediationById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertMediation: DomainDeps['upsertMediation']
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

        const mediationResult = await deps.getMediationById(mediationId.value)
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

export const _activateMediation = activateMediationShellFactory(shellSteps)
