import type { MediateProcessingShellFn } from './mediate-processing.spec'
import type { DomainDeps } from '../../domain-deps'
import type { MediateProcessingFn } from './core/mediate-processing.spec'
import { mediateProcessing as mediateProcessingCore } from './core/mediate-processing'
import { _safeGetIncomingProcessingById } from '../safe-get-incoming-processing-by-id'
import { _safeGenerateTimestamp } from '../../shared/safe-generate-timestamp'

type ShellSteps = {
    safeGetIncomingProcessingById: typeof _safeGetIncomingProcessingById
    safeGenerateTimestamp: typeof _safeGenerateTimestamp
    mediateProcessingCore: MediateProcessingFn['signature']
}

type Deps = {
    getIncomingProcessingById: DomainDeps['getIncomingProcessingById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertIncomingProcessing: DomainDeps['upsertIncomingProcessing']
}

const mediateProcessingShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): MediateProcessingShellFn['asyncSignature'] => {
    const getIncomingProcessingById = steps.safeGetIncomingProcessingById(deps.getIncomingProcessingById)
    const generateTimestamp = steps.safeGenerateTimestamp(deps.generateTimestamp)

    return async (input) => {
        const stateResult = await getIncomingProcessingById(input.cmd.processingId)
        if (!stateResult.ok) return stateResult as any
        if (stateResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const mediatedAtResult = await generateTimestamp()
        if (!mediatedAtResult.ok) return mediatedAtResult as any
        const mediatedAt = mediatedAtResult.value

        const result = steps.mediateProcessingCore({
            cmd: { processingId: input.cmd.processingId },
            state: stateResult.value!,
            ctx: { outcomes: input.cmd.outcomes, mediatedAt },
        })
        if (!result.ok) return result as any

        await deps.upsertIncomingProcessing(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }
    }

export const _mediateProcessing = mediateProcessingShellFactory({
    safeGetIncomingProcessingById: _safeGetIncomingProcessingById,
    safeGenerateTimestamp: _safeGenerateTimestamp,
    mediateProcessingCore,
})
