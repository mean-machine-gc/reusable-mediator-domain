import type { FailProcessingShellFn } from './fail-processing.spec'
import type { DomainDeps } from '../../domain-deps'
import type { FailProcessingFn } from './core/fail-processing.spec'
import { failProcessing as failProcessingCore } from './core/fail-processing'

type Steps = {
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
        const stateResult = await deps.getIncomingProcessingById(input.cmd.processingId)
        if (stateResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const failedAtResult = await deps.generateTimestamp()
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

export const _failProcessing = failProcessingShellFactory({
    failProcessingCore,
})
