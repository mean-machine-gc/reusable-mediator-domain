import type { ActivateMediationShellFn } from './activate-mediation.spec'
import type { DomainDeps } from '../../domain-deps'
import { activateMediationCore } from './core/activate-mediation'
import { _safeGetMediationById } from '../safe-get-mediation-by-id'
import { _safeGenerateTimestamp } from '../../shared/safe-generate-timestamp'

type ShellSteps = {
    safeGetMediationById: typeof _safeGetMediationById
    safeGenerateTimestamp: typeof _safeGenerateTimestamp
    activateMediationCore: typeof activateMediationCore
}

type Deps = {
    getMediationById: DomainDeps['getMediationById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertMediation: DomainDeps['upsertMediation']
}

const activateMediationShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): ActivateMediationShellFn['asyncSignature'] => {
    const getMediationById = steps.safeGetMediationById(deps.getMediationById)
    const generateTimestamp = steps.safeGenerateTimestamp(deps.generateTimestamp)

    return async (input) => {
        const mediationResult = await getMediationById(input.cmd.mediationId)
        if (!mediationResult.ok) return mediationResult as any
        if (mediationResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const activatedAtResult = await generateTimestamp()
        if (!activatedAtResult.ok) return activatedAtResult as any

        const activated = steps.activateMediationCore({
            state: mediationResult.value!,
            ctx: { activatedAt: activatedAtResult.value },
        })
        if (!activated.ok) return activated as any

        await deps.upsertMediation(activated.value)

        return { ok: true, value: activated.value, successType: activated.successType }
    }
    }

export const _activateMediation = activateMediationShellFactory({
    safeGetMediationById: _safeGetMediationById,
    safeGenerateTimestamp: _safeGenerateTimestamp,
    activateMediationCore,
})
