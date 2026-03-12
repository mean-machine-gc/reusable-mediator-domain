import type { RecordDeliveryShellFn } from './record-delivery.spec'
import type { Dispatch, DeliveryAttempt } from '../types'
import type { ParseDispatchIdFn } from '../shared/steps/parse-dispatch-id.spec'
import type { RecordDeliveryFn } from './core/record-delivery.spec'
import { parseDispatchId } from '../shared/steps/parse-dispatch-id'
import { recordDelivery as recordDeliveryCore } from './core/record-delivery'

type Steps = {
    parseDispatchId: ParseDispatchIdFn['signature']
    recordDeliveryCore: RecordDeliveryFn['signature']
}

type Deps = {
    loadState: (id: string) => Promise<Dispatch | null>
    deliver: (dispatch: Dispatch) => Promise<DeliveryAttempt>
    getMaxAttempts: () => Promise<number>
    save: (aggregate: Dispatch) => Promise<void>
}

const recordDeliveryShellFactory =
    (steps: Steps) =>
    (deps: Deps): RecordDeliveryShellFn['asyncSignature'] =>
    async (input) => {
        const parsed = steps.parseDispatchId(input.cmd.dispatchId)
        if (!parsed.ok) return parsed as any

        const state = await deps.loadState(parsed.value)
        if (!state) return { ok: false, errors: ['not_found'] } as any

        const attempt = await deps.deliver(state)
        const maxAttempts = await deps.getMaxAttempts()

        const result = steps.recordDeliveryCore({
            cmd: { dispatchId: parsed.value },
            state,
            ctx: { attempt, maxAttempts },
        })
        if (!result.ok) return result as any

        await deps.save(result.value)

        return { ok: true, value: result.value, successType: result.successType }
    }

export const recordDelivery = recordDeliveryShellFactory({
    parseDispatchId,
    recordDeliveryCore,
})
