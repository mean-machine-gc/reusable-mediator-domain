import type { RecordDeliveryShellFn } from './record-delivery.spec'
import type { DomainDeps } from '../../domain-deps'
import type { ParseDispatchIdFn } from '../shared/steps/parse-dispatch-id.spec'
import type { RecordDeliveryFn } from './core/record-delivery.spec'
import { parseDispatchId } from '../shared/steps/parse-dispatch-id'
import { recordDelivery as recordDeliveryCore } from './core/record-delivery'

type Steps = {
    parseDispatchId: ParseDispatchIdFn['signature']
    recordDeliveryCore: RecordDeliveryFn['signature']
}

type Deps = {
    getDispatchById: DomainDeps['getDispatchById']
    deliver: DomainDeps['deliver']
    getMaxAttempts: DomainDeps['getMaxAttempts']
    upsertDispatch: DomainDeps['upsertDispatch']
}

const recordDeliveryShellFactory =
    (steps: Steps) =>
    (deps: Deps): RecordDeliveryShellFn['asyncSignature'] =>
    async (input) => {
        const parsed = steps.parseDispatchId(input.cmd.dispatchId)
        if (!parsed.ok) return parsed as any

        const stateResult = await deps.getDispatchById(parsed.value)
        if (stateResult.successType.includes('not-found')) return { ok: false, errors: ['not_found'] } as any

        const attemptResult = await deps.deliver(stateResult.value!)
        const maxAttemptsResult = await deps.getMaxAttempts()

        const result = steps.recordDeliveryCore({
            cmd: { dispatchId: parsed.value },
            state: stateResult.value!,
            ctx: { attempt: attemptResult.value, maxAttempts: maxAttemptsResult.value },
        })
        if (!result.ok) return result as any

        await deps.upsertDispatch(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }

export const _recordDelivery = recordDeliveryShellFactory({
    parseDispatchId,
    recordDeliveryCore,
})
