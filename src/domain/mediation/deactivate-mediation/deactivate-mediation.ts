import type { DeactivateMediationShellFn } from './deactivate-mediation.spec'
import type { DomainDeps } from '../../domain-deps'
import { deactivateMediationCore } from './core/deactivate-mediation'
import { _safeGetMediationById } from '../safe-get-mediation-by-id'
import { _safeGenerateTimestamp } from '../../shared/safe-generate-timestamp'

type ShellSteps = {
    safeGetMediationById: typeof _safeGetMediationById
    safeGenerateTimestamp: typeof _safeGenerateTimestamp
    deactivateMediationCore: typeof deactivateMediationCore
}

type Deps = {
    getMediationById: DomainDeps['getMediationById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertMediation: DomainDeps['upsertMediation']
}

const deactivateMediationShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): DeactivateMediationShellFn['asyncSignature'] => {
    const getMediationById = steps.safeGetMediationById(deps.getMediationById)
    const generateTimestamp = steps.safeGenerateTimestamp(deps.generateTimestamp)

    return async (input) => {
        const mediationResult = await getMediationById(input.cmd.mediationId)
        if (!mediationResult.ok) return mediationResult as any
        if (mediationResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const deactivatedAtResult = await generateTimestamp()
        if (!deactivatedAtResult.ok) return deactivatedAtResult as any

        const deactivated = steps.deactivateMediationCore({
            state: mediationResult.value!,
            ctx: { deactivatedAt: deactivatedAtResult.value },
        })
        if (!deactivated.ok) return deactivated as any

        await deps.upsertMediation(deactivated.value)

        return { ok: true, value: deactivated.value, successType: deactivated.successType }
    }
    }

export const _deactivateMediation = deactivateMediationShellFactory({
    safeGetMediationById: _safeGetMediationById,
    safeGenerateTimestamp: _safeGenerateTimestamp,
    deactivateMediationCore,
})
