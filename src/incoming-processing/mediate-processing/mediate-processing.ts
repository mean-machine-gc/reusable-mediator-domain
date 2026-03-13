import type { MediateProcessingShellFn } from './mediate-processing.spec'
import type { DomainDeps } from '../../domain-deps'
import type { MediateProcessingFn } from './core/mediate-processing.spec'
import { mediateProcessing as mediateProcessingCore } from './core/mediate-processing'

type Steps = {
    mediateProcessingCore: MediateProcessingFn['signature']
}

type Deps = {
    getIncomingProcessingById: DomainDeps['getIncomingProcessingById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertIncomingProcessing: DomainDeps['upsertIncomingProcessing']
}

const mediateProcessingShellFactory =
    (steps: Steps) =>
    (deps: Deps): MediateProcessingShellFn['asyncSignature'] =>
    async (input) => {
        const stateResult = await deps.getIncomingProcessingById(input.cmd.processingId)
        if (stateResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const mediatedAtResult = await deps.generateTimestamp()
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

export const _mediateProcessing = mediateProcessingShellFactory({
    mediateProcessingCore,
})
