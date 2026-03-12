import type { PollDispatchesFn } from './poll-dispatches.spec'
import type { DeliveryResultEntry } from './steps/classify-delivery-results.spec'
import type { ToDeliverDispatch, AttemptedDispatch } from '../../dispatches/types'
import type { Result } from '../../shared/spec-framework'
import type { ClassifyDeliveryResultsFn } from './steps/classify-delivery-results.spec'
import { classifyDeliveryResults } from './steps/classify-delivery-results'

type Steps = {
    classifyDeliveryResults: ClassifyDeliveryResultsFn['signature']
}

type Deps = {
    fetchDispatches: (batchSize: number) => Promise<(ToDeliverDispatch | AttemptedDispatch)[]>
    recordDelivery: (input: { cmd: { dispatchId: string } }) => Promise<Result<any, string, string>>
}

const pollDispatchesFactory =
    (steps: Steps) =>
    (deps: Deps): PollDispatchesFn['asyncSignature'] =>
    async (input) => {
        const batch = await deps.fetchDispatches(input.batchSize)

        if (batch.length === 0) {
            return { ok: true, value: { delivered: [], retrying: [], exhausted: [] }, successType: ['empty-batch'] }
        }

        const entries: DeliveryResultEntry[] = []

        for (const dispatch of batch) {
            const result = await deps.recordDelivery({ cmd: { dispatchId: dispatch.id } })

            if (result.ok) {
                const successType = result.successType[0] as DeliveryResultEntry['successType']
                entries.push({ dispatchId: dispatch.id, successType })
            }
        }

        const classified = steps.classifyDeliveryResults({ entries })
        if (!classified.ok) return classified as any

        return { ok: true, value: classified.value, successType: ['batch-processed'] }
    }

export const pollDispatches = pollDispatchesFactory({
    classifyDeliveryResults,
})
