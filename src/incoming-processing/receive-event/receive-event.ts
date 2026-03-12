import type { ReceiveEventShellFn } from './receive-event.spec'
import type { IncomingProcessing, ReceivedProcessing, ReceivedAt } from '../types'
import type { ParseProcessingIdFn } from '../shared/steps/parse-processing-id.spec'
import type { ReceiveEventFn } from './core/receive-event.spec'
import { parseProcessingId } from '../shared/steps/parse-processing-id'
import { receiveEvent as receiveEventCore } from './core/receive-event'

type Steps = {
    parseProcessingId: ParseProcessingIdFn['signature']
    receiveEventCore: ReceiveEventFn['signature']
}

type Deps = {
    loadState: (id: string) => Promise<IncomingProcessing | null>
    generateReceivedAt: () => Promise<ReceivedAt>
    save: (aggregate: ReceivedProcessing) => Promise<void>
}

const receiveEventShellFactory =
    (steps: Steps) =>
    (deps: Deps): ReceiveEventShellFn['asyncSignature'] =>
    async (input) => {
        const parsed = steps.parseProcessingId(input.cmd.processingId)
        if (!parsed.ok) return parsed as any

        const state = await deps.loadState(parsed.value)

        const receivedAt = await deps.generateReceivedAt()

        const result = steps.receiveEventCore({
            cmd: { processingId: parsed.value, event: input.cmd.event as any },
            state,
            ctx: { receivedAt },
        })
        if (!result.ok) return result as any

        await deps.save(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }

export const receiveEvent = receiveEventShellFactory({
    parseProcessingId,
    receiveEventCore,
})
