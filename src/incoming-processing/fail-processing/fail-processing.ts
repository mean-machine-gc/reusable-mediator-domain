import type { FailProcessingShellFn } from './fail-processing.spec'
import type { DomainDeps } from '../../domain-deps'
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
    getIncomingProcessingById: DomainDeps['getIncomingProcessingById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertIncomingProcessing: DomainDeps['upsertIncomingProcessing']
}

const failProcessingShellFactory =
    (steps: Steps) =>
    (deps: Deps): FailProcessingShellFn['asyncSignature'] =>
    async (input) => {
        const parsedId = steps.parseProcessingId(input.cmd.processingId)
        if (!parsedId.ok) return parsedId as any

        const parsedReason = steps.parseProcessingFailureReason(input.cmd.reason)
        if (!parsedReason.ok) return parsedReason as any

        const stateResult = await deps.getIncomingProcessingById(parsedId.value)
        if (stateResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const failedAtResult = await deps.generateTimestamp()
        const failedAt = failedAtResult.value

        const result = steps.failProcessingCore({
            cmd: { processingId: parsedId.value, reason: parsedReason.value },
            state: stateResult.value!,
            ctx: { failedAt },
        })
        if (!result.ok) return result as any

        await deps.upsertIncomingProcessing(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }

export const _failProcessing = failProcessingShellFactory({
    parseProcessingId,
    parseProcessingFailureReason,
    failProcessingCore,
})
