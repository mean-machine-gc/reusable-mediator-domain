import type { ReceiveEventShellFn } from './receive-event.spec'
import type { DomainDeps } from '../../domain-deps'
import type { ReceiveEventFn } from './core/receive-event.spec'
import { receiveEvent as receiveEventCore } from './core/receive-event'

type Steps = {
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
        const stateResult = await deps.getIncomingProcessingById(input.cmd.processingId)
        const state = stateResult.value

        const receivedAtResult = await deps.generateTimestamp()
        const receivedAt = receivedAtResult.value

        const result = steps.receiveEventCore({
            cmd: { processingId: input.cmd.processingId, event: input.cmd.event as any },
            state,
            ctx: { receivedAt },
        })
        if (!result.ok) return result as any

        await deps.upsertIncomingProcessing(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }

export const _receiveEvent = receiveEventShellFactory({
    receiveEventCore,
})
