import type { MediateProcessingShellFn } from './mediate-processing.spec'
import type { IncomingProcessing, MediatedProcessing, MediatedAt } from '../types'
import type { ParseProcessingIdFn } from '../shared/steps/parse-processing-id.spec'
import type { MediateProcessingFn } from './core/mediate-processing.spec'
import { parseProcessingId } from '../shared/steps/parse-processing-id'
import { mediateProcessing as mediateProcessingCore } from './core/mediate-processing'

type Steps = {
    parseProcessingId: ParseProcessingIdFn['signature']
    mediateProcessingCore: MediateProcessingFn['signature']
}

type Deps = {
    loadState: (id: string) => Promise<IncomingProcessing | null>
    generateMediatedAt: () => Promise<MediatedAt>
    save: (aggregate: MediatedProcessing) => Promise<void>
}

const mediateProcessingShellFactory =
    (steps: Steps) =>
    (deps: Deps): MediateProcessingShellFn['asyncSignature'] =>
    async (input) => {
        const parsed = steps.parseProcessingId(input.cmd.processingId)
        if (!parsed.ok) return parsed as any

        const state = await deps.loadState(parsed.value)
        if (!state) return { ok: false, errors: ['not_found'] } as any

        const mediatedAt = await deps.generateMediatedAt()

        const result = steps.mediateProcessingCore({
            cmd: { processingId: parsed.value },
            state,
            ctx: { outcomes: input.cmd.outcomes, mediatedAt },
        })
        if (!result.ok) return result as any

        await deps.save(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }

export const mediateProcessing = mediateProcessingShellFactory({
    parseProcessingId,
    mediateProcessingCore,
})
