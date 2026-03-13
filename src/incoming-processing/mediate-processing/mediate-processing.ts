import type { MediateProcessingShellFn } from './mediate-processing.spec'
import type { DomainDeps } from '../../domain-deps'
import type { ParseProcessingIdFn } from '../shared/steps/parse-processing-id.spec'
import type { MediateProcessingFn } from './core/mediate-processing.spec'
import { parseProcessingId } from '../shared/steps/parse-processing-id'
import { mediateProcessing as mediateProcessingCore } from './core/mediate-processing'

type Steps = {
    parseProcessingId: ParseProcessingIdFn['signature']
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
        const parsed = steps.parseProcessingId(input.cmd.processingId)
        if (!parsed.ok) return parsed as any

        const stateResult = await deps.getIncomingProcessingById(parsed.value)
        if (stateResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const mediatedAtResult = await deps.generateTimestamp()
        const mediatedAt = mediatedAtResult.value

        const result = steps.mediateProcessingCore({
            cmd: { processingId: parsed.value },
            state: stateResult.value!,
            ctx: { outcomes: input.cmd.outcomes, mediatedAt },
        })
        if (!result.ok) return result as any

        await deps.upsertIncomingProcessing(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }

export const _mediateProcessing = mediateProcessingShellFactory({
    parseProcessingId,
    mediateProcessingCore,
})
