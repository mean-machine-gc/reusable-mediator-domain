import type { CreateDispatchShellFn } from './create-dispatch.spec'
import type { DomainDeps } from '../../domain-deps'
import type { CreateDispatchFn } from './core/create-dispatch.spec'
import { createDispatch as createDispatchCore } from './core/create-dispatch'

type Steps = {
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
        const stateResult = await deps.getDispatchById(input.cmd.dispatchId)
        const state = stateResult.value

        const createdAtResult = await deps.generateTimestamp()
        const createdAt = createdAtResult.value

        const result = steps.createDispatchCore({
            cmd: {
                dispatchId: input.cmd.dispatchId,
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
    createDispatchCore,
})
