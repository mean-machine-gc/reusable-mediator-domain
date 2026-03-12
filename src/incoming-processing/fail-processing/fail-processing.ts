import type { FailProcessingShellFn } from './fail-processing.spec'
import type { IncomingProcessing, FailedProcessing, FailedAt } from '../types'
import type { ParseProcessingIdFn } from '../shared/steps/parse-processing-id.spec'
import type { ParseProcessingFailureReasonFn } from '../shared/steps/parse-processing-failure-reason.spec'
import type { FailProcessingFn } from './core/fail-processing.spec'
import { parseProcessingId } from '../shared/steps/parse-processing-id'
import { parseProcessingFailureReason } from '../shared/steps/parse-processing-failure-reason'
import { failProcessing as failProcessingCore } from './core/fail-processing'

type Steps = {
    parseProcessingId: ParseProcessingIdFn['signature']
    parseProcessingFailureReason: ParseProcessingFailureReasonFn['signature']
    failProcessingCore: FailProcessingFn['signature']
}

type Deps = {
    loadState: (id: string) => Promise<IncomingProcessing | null>
    generateFailedAt: () => Promise<FailedAt>
    save: (aggregate: FailedProcessing) => Promise<void>
}

const failProcessingShellFactory =
    (steps: Steps) =>
    (deps: Deps): FailProcessingShellFn['asyncSignature'] =>
    async (input) => {
        const parsedId = steps.parseProcessingId(input.cmd.processingId)
        if (!parsedId.ok) return parsedId as any

        const parsedReason = steps.parseProcessingFailureReason(input.cmd.reason)
        if (!parsedReason.ok) return parsedReason as any

        const state = await deps.loadState(parsedId.value)
        if (!state) return { ok: false, errors: ['not_found'] } as any

        const failedAt = await deps.generateFailedAt()

        const result = steps.failProcessingCore({
            cmd: { processingId: parsedId.value, reason: parsedReason.value },
            state,
            ctx: { failedAt },
        })
        if (!result.ok) return result as any

        await deps.save(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }

export const failProcessing = failProcessingShellFactory({
    parseProcessingId,
    parseProcessingFailureReason,
    failProcessingCore,
})
