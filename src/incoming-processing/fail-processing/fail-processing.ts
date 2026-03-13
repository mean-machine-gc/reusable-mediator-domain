import type { FailProcessingShellFn } from './fail-processing.spec'
import type { DomainDeps } from '../../domain-deps'
import type { FailProcessingFn } from './core/fail-processing.spec'
import { failProcessing as failProcessingCore } from './core/fail-processing'
import { _safeGetIncomingProcessingById } from '../safe-get-incoming-processing-by-id'
import { _safeGenerateTimestamp } from '../../shared/safe-generate-timestamp'

type ShellSteps = {
    safeGetIncomingProcessingById: typeof _safeGetIncomingProcessingById
    safeGenerateTimestamp: typeof _safeGenerateTimestamp
    failProcessingCore: FailProcessingFn['signature']
}

type Deps = {
    getIncomingProcessingById: DomainDeps['getIncomingProcessingById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertIncomingProcessing: DomainDeps['upsertIncomingProcessing']
}

const failProcessingShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): FailProcessingShellFn['asyncSignature'] => {
    const getIncomingProcessingById = steps.safeGetIncomingProcessingById(deps.getIncomingProcessingById)
    const generateTimestamp = steps.safeGenerateTimestamp(deps.generateTimestamp)

    return async (input) => {
        const stateResult = await getIncomingProcessingById(input.cmd.processingId)
        if (!stateResult.ok) return stateResult as any
        if (stateResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const failedAtResult = await generateTimestamp()
        if (!failedAtResult.ok) return failedAtResult as any
        const failedAt = failedAtResult.value

        const result = steps.failProcessingCore({
            cmd: { processingId: input.cmd.processingId, reason: input.cmd.reason },
            state: stateResult.value!,
            ctx: { failedAt },
        })
        if (!result.ok) return result as any

        await deps.upsertIncomingProcessing(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }
    }

export const _failProcessing = failProcessingShellFactory({
    safeGetIncomingProcessingById: _safeGetIncomingProcessingById,
    safeGenerateTimestamp: _safeGenerateTimestamp,
    failProcessingCore,
})
