import type { ReceiveEventShellFn } from './receive-event.spec'
import type { DomainDeps } from '../../domain-deps'
import type { ReceiveEventFn } from './core/receive-event.spec'
import { receiveEvent as receiveEventCore } from './core/receive-event'
import { _safeGetIncomingProcessingById } from '../safe-get-incoming-processing-by-id'
import { _safeGenerateTimestamp } from '../../shared/safe-generate-timestamp'

type ShellSteps = {
    safeGetIncomingProcessingById: typeof _safeGetIncomingProcessingById
    safeGenerateTimestamp: typeof _safeGenerateTimestamp
    receiveEventCore: ReceiveEventFn['signature']
}

type Deps = {
    getIncomingProcessingById: DomainDeps['getIncomingProcessingById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertIncomingProcessing: DomainDeps['upsertIncomingProcessing']
}

const receiveEventShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): ReceiveEventShellFn['asyncSignature'] => {
    const getIncomingProcessingById = steps.safeGetIncomingProcessingById(deps.getIncomingProcessingById)
    const generateTimestamp = steps.safeGenerateTimestamp(deps.generateTimestamp)

    return async (input) => {
        const stateResult = await getIncomingProcessingById(input.cmd.processingId)
        if (!stateResult.ok) return stateResult as any
        const state = stateResult.value

        const receivedAtResult = await generateTimestamp()
        if (!receivedAtResult.ok) return receivedAtResult as any
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
    }

export const _receiveEvent = receiveEventShellFactory({
    safeGetIncomingProcessingById: _safeGetIncomingProcessingById,
    safeGenerateTimestamp: _safeGenerateTimestamp,
    receiveEventCore,
})
