import type { CreateDispatchShellFn } from './create-dispatch.spec'
import type { DomainDeps } from '../../domain-deps'
import type { CreateDispatchFn } from './core/create-dispatch.spec'
import { createDispatch as createDispatchCore } from './core/create-dispatch'
import { _safeGetDispatchById } from '../safe-get-dispatch-by-id'
import { _safeGenerateTimestamp } from '../../shared/safe-generate-timestamp'

type ShellSteps = {
    safeGetDispatchById: typeof _safeGetDispatchById
    safeGenerateTimestamp: typeof _safeGenerateTimestamp
    createDispatchCore: CreateDispatchFn['signature']
}

type Deps = {
    getDispatchById: DomainDeps['getDispatchById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertDispatch: DomainDeps['upsertDispatch']
}

const createDispatchShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): CreateDispatchShellFn['asyncSignature'] => {
    const getDispatchById = steps.safeGetDispatchById(deps.getDispatchById)
    const generateTimestamp = steps.safeGenerateTimestamp(deps.generateTimestamp)

    return async (input) => {
        const stateResult = await getDispatchById(input.cmd.dispatchId)
        if (!stateResult.ok) return stateResult as any
        const state = stateResult.value

        const createdAtResult = await generateTimestamp()
        if (!createdAtResult.ok) return createdAtResult as any
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
    }

export const _createDispatch = createDispatchShellFactory({
    safeGetDispatchById: _safeGetDispatchById,
    safeGenerateTimestamp: _safeGenerateTimestamp,
    createDispatchCore,
})
