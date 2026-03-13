import type { PollDispatchesFn } from './poll-dispatches.spec'
import type { DeliveryResultEntry } from './steps/classify-delivery-results.spec'
import type { DomainDeps } from '../../domain-deps'
import type { ClassifyDeliveryResultsFn } from './steps/classify-delivery-results.spec'
import { classifyDeliveryResults } from './steps/classify-delivery-results'
import { _recordDelivery } from '../../dispatches/record-delivery/record-delivery'

type Steps = {
    classifyDeliveryResults: ClassifyDeliveryResultsFn['signature']
    recordDelivery: typeof _recordDelivery
}

type Deps = {
    findDispatchesByState: DomainDeps['findDispatchesByState']
    getDispatchById: DomainDeps['getDispatchById']
    deliver: DomainDeps['deliver']
    getMaxAttempts: DomainDeps['getMaxAttempts']
    upsertDispatch: DomainDeps['upsertDispatch']
}

const pollDispatchesFactory =
    (steps: Steps) =>
    (deps: Deps): PollDispatchesFn['asyncSignature'] => {
        const doRecordDelivery = steps.recordDelivery({
            getDispatchById: deps.getDispatchById,
            deliver: deps.deliver,
            getMaxAttempts: deps.getMaxAttempts,
            upsertDispatch: deps.upsertDispatch,
        })

        return async (input) => {
            const batchResult = await deps.findDispatchesByState({ states: ['to-deliver', 'attempted'], batchSize: input.batchSize })

            if (batchResult.successType.includes('empty')) {
                return { ok: true, value: { delivered: [], retrying: [], exhausted: [] }, successType: ['empty-batch'] }
            }

            const entries: DeliveryResultEntry[] = []

            for (const dispatch of batchResult.value) {
                const result = await doRecordDelivery({ cmd: { dispatchId: dispatch.id } })

                if (result.ok) {
                    const successType = result.successType[0] as DeliveryResultEntry['successType']
                    entries.push({ dispatchId: dispatch.id, successType })
                }
            }

            const classified = steps.classifyDeliveryResults({ entries })
            if (!classified.ok) return classified as any

            return { ok: true, value: classified.value, successType: ['batch-processed'] }
        }
    }

export const _pollDispatches = pollDispatchesFactory({
    classifyDeliveryResults,
    recordDelivery: _recordDelivery,
})
