import type { CreateDispatchShellFn } from './create-dispatch.spec'
import type { Dispatch, ToDeliverDispatch, CreatedAt } from '../types'
import type { ParseDispatchIdFn } from '../shared/steps/parse-dispatch-id.spec'
import type { CreateDispatchFn } from './core/create-dispatch.spec'
import { parseDispatchId } from '../shared/steps/parse-dispatch-id'
import { createDispatch as createDispatchCore } from './core/create-dispatch'

type Steps = {
    parseDispatchId: ParseDispatchIdFn['signature']
    createDispatchCore: CreateDispatchFn['signature']
}

type Deps = {
    loadState: (id: string) => Promise<Dispatch | null>
    generateCreatedAt: () => Promise<CreatedAt>
    save: (aggregate: ToDeliverDispatch) => Promise<void>
}

const createDispatchShellFactory =
    (steps: Steps) =>
    (deps: Deps): CreateDispatchShellFn['asyncSignature'] =>
    async (input) => {
        const parsed = steps.parseDispatchId(input.cmd.dispatchId)
        if (!parsed.ok) return parsed as any

        const state = await deps.loadState(parsed.value)

        const createdAt = await deps.generateCreatedAt()

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

        await deps.save(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }

export const createDispatch = createDispatchShellFactory({
    parseDispatchId,
    createDispatchCore,
})
