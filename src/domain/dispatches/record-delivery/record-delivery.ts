import type { RecordDeliveryShellFn } from './record-delivery.spec'
import type { DomainDeps } from '../../domain-deps'
import type { RecordDeliveryFn } from './core/record-delivery.spec'
import { recordDelivery as recordDeliveryCore } from './core/record-delivery'
import { _safeGetDispatchById } from '../safe-get-dispatch-by-id'
import { _safeDeliver } from '../safe-deliver'

type ShellSteps = {
    safeGetDispatchById: typeof _safeGetDispatchById
    safeDeliver: typeof _safeDeliver
    recordDeliveryCore: RecordDeliveryFn['signature']
}

type Deps = {
    getDispatchById: DomainDeps['getDispatchById']
    deliver: DomainDeps['deliver']
    getMaxAttempts: DomainDeps['getMaxAttempts']
    upsertDispatch: DomainDeps['upsertDispatch']
}

const recordDeliveryShellFactory =
    (steps: ShellSteps) =>
    (deps: Deps): RecordDeliveryShellFn['asyncSignature'] => {
    const getDispatchById = steps.safeGetDispatchById(deps.getDispatchById)
    const deliver = steps.safeDeliver(deps.deliver)

    return async (input) => {
        const stateResult = await getDispatchById(input.cmd.dispatchId)
        if (!stateResult.ok) return stateResult as any
        if (stateResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const attemptResult = await deliver(stateResult.value!)
        if (!attemptResult.ok) return attemptResult as any
        const maxAttemptsResult = await deps.getMaxAttempts()

        const result = steps.recordDeliveryCore({
            cmd: { dispatchId: input.cmd.dispatchId },
            state: stateResult.value!,
            ctx: { attempt: attemptResult.value, maxAttempts: maxAttemptsResult.value },
        })
        if (!result.ok) return result as any

        await deps.upsertDispatch(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }
    }

export const _recordDelivery = recordDeliveryShellFactory({
    safeGetDispatchById: _safeGetDispatchById,
    safeDeliver: _safeDeliver,
    recordDeliveryCore,
})
