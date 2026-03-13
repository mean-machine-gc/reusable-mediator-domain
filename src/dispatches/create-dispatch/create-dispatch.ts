import type { CreateDispatchShellFn } from './create-dispatch.spec'
import type { DomainDeps } from '../../domain-deps'
import type { ParseDispatchIdFn } from '../shared/steps/parse-dispatch-id.spec'
import type { CreateDispatchFn } from './core/create-dispatch.spec'
import { parseDispatchId } from '../shared/steps/parse-dispatch-id'
import { createDispatch as createDispatchCore } from './core/create-dispatch'

type Steps = {
    parseDispatchId: ParseDispatchIdFn['signature']
    createDispatchCore: CreateDispatchFn['signature']
}

type Deps = {
    getDispatchById: DomainDeps['getDispatchById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertDispatch: DomainDeps['upsertDispatch']
}

const createDispatchShellFactory =
    (steps: Steps) =>
    (deps: Deps): CreateDispatchShellFn['asyncSignature'] =>
    async (input) => {
        const parsed = steps.parseDispatchId(input.cmd.dispatchId)
        if (!parsed.ok) return parsed as any

        const stateResult = await deps.getDispatchById(parsed.value)
        const state = stateResult.value

        const createdAtResult = await deps.generateTimestamp()
        const createdAt = createdAtResult.value

        const result = steps.createDispatchCore({
            cmd: {
                dispatchId: parsed.value,
                processingId: input.cmd.processingId as any,
                mediationId: input.cmd.mediationId as any,
                destination: input.cmd.destination as any,
                event: input.cmd.event as any,
            },
            state,
            ctx: { createdAt },
        })
        if (!result.ok) return result as any

        await deps.upsertDispatch(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }

export const _createDispatch = createDispatchShellFactory({
    parseDispatchId,
    createDispatchCore,
})
