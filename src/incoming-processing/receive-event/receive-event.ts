import type { ReceiveEventShellFn } from './receive-event.spec'
import type { DomainDeps } from '../../domain-deps'
import type { ParseProcessingIdFn } from '../shared/steps/parse-processing-id.spec'
import type { ReceiveEventFn } from './core/receive-event.spec'
import { parseProcessingId } from '../shared/steps/parse-processing-id'
import { receiveEvent as receiveEventCore } from './core/receive-event'

type Steps = {
    parseProcessingId: ParseProcessingIdFn['signature']
    receiveEventCore: ReceiveEventFn['signature']
}

type Deps = {
    getIncomingProcessingById: DomainDeps['getIncomingProcessingById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertIncomingProcessing: DomainDeps['upsertIncomingProcessing']
}

const receiveEventShellFactory =
    (steps: Steps) =>
    (deps: Deps): ReceiveEventShellFn['asyncSignature'] =>
    async (input) => {
        const parsed = steps.parseProcessingId(input.cmd.processingId)
        if (!parsed.ok) return parsed as any

        const stateResult = await deps.getIncomingProcessingById(parsed.value)
        const state = stateResult.value

        const receivedAtResult = await deps.generateTimestamp()
        const receivedAt = receivedAtResult.value

        const result = steps.receiveEventCore({
            cmd: { processingId: parsed.value, event: input.cmd.event as any },
            state,
            ctx: { receivedAt },
        })
        if (!result.ok) return result as any

        await deps.upsertIncomingProcessing(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }

export const _receiveEvent = receiveEventShellFactory({
    parseProcessingId,
    receiveEventCore,
})
