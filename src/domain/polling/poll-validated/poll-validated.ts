import type { PollValidatedFn } from './poll-validated.spec'
import type { DomainDeps } from '../../domain-deps'
import type { MediatedEntry, MediationFailureEntry } from '../types'
import type { MediateAllFn } from './steps/mediate-all.spec'
import { mediateAll } from './steps/mediate-all'
import { _createDispatch } from '../../dispatches/create-dispatch/create-dispatch'
import { _mediateProcessing } from '../../incoming-processing/mediate-processing/mediate-processing'
import { _failProcessing } from '../../incoming-processing/fail-processing/fail-processing'
import { _safeGenerateId } from '../../shared/safe-generate-id'

type Steps = {
    mediateAll: MediateAllFn['signature']
    safeGenerateId: typeof _safeGenerateId
    createDispatch: typeof _createDispatch
    mediateProcessing: typeof _mediateProcessing
    failProcessing: typeof _failProcessing
}

type Deps = {
    findIncomingProcessingsByState: DomainDeps['findIncomingProcessingsByState']
    findActiveMediationsByTopic: DomainDeps['findActiveMediationsByTopic']
    getTransformRegistry: DomainDeps['getTransformRegistry']
    generateId: DomainDeps['generateId']
    getDispatchById: DomainDeps['getDispatchById']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertDispatch: DomainDeps['upsertDispatch']
    getIncomingProcessingById: DomainDeps['getIncomingProcessingById']
    upsertIncomingProcessing: DomainDeps['upsertIncomingProcessing']
}

const pollValidatedFactory =
    (steps: Steps) =>
    (deps: Deps): PollValidatedFn['asyncSignature'] => {
        const generateId = steps.safeGenerateId(deps.generateId)
        const doCreateDispatch = steps.createDispatch({
            getDispatchById: deps.getDispatchById,
            generateTimestamp: deps.generateTimestamp,
            upsertDispatch: deps.upsertDispatch,
        })
        const doMediateProcessing = steps.mediateProcessing({
            getIncomingProcessingById: deps.getIncomingProcessingById,
            generateTimestamp: deps.generateTimestamp,
            upsertIncomingProcessing: deps.upsertIncomingProcessing,
        })
        const doFailProcessing = steps.failProcessing({
            getIncomingProcessingById: deps.getIncomingProcessingById,
            generateTimestamp: deps.generateTimestamp,
            upsertIncomingProcessing: deps.upsertIncomingProcessing,
        })

        return async (input) => {
            const batchResult = await deps.findIncomingProcessingsByState({ states: ['validated'], batchSize: input.batchSize })

            if (batchResult.successType.includes('empty')) {
                return { ok: true, value: { mediated: [], failed: [] }, successType: ['empty-batch'] }
            }

            const mediated: MediatedEntry[] = []
            const failed: MediationFailureEntry[] = []

            for (const record of batchResult.value) {
                try {
                    const mediationsResult = await deps.findActiveMediationsByTopic(record.topic)
                    const registryResult = await deps.getTransformRegistry()

                    const result = steps.mediateAll({
                        event: record.event,
                        mediations: mediationsResult.value,
                        registry: registryResult.value,
                    })

                    if (!result.ok) {
                        throw new Error(result.errors.join(', '))
                    }

                    const outcomes = result.value
                    const dispatches: { dispatchId: string; destination: string }[] = []
                    const skipped: string[] = []

                    for (const outcome of outcomes) {
                        if (outcome.result === 'dispatched') {
                            const dispatchIdResult = await generateId()
                            if (!dispatchIdResult.ok) throw new Error(dispatchIdResult.errors.join(', '))

                            await doCreateDispatch({
                                cmd: {
                                    dispatchId: dispatchIdResult.value,
                                    processingId: record.id,
                                    mediationId: outcome.mediationId,
                                    destination: outcome.destination,
                                    event: outcome.event,
                                },
                            })

                            dispatches.push({ dispatchId: dispatchIdResult.value, destination: outcome.destination })
                        } else {
                            skipped.push(outcome.mediationId)
                        }
                    }

                    await doMediateProcessing({
                        cmd: { processingId: record.id, outcomes },
                    })

                    mediated.push({ processingId: record.id, dispatches, skipped })
                } catch (err) {
                    const reason = err instanceof Error ? err.message : String(err)
                    await doFailProcessing({
                        cmd: { processingId: record.id, reason },
                    })
                    failed.push({ processingId: record.id, errors: [reason] })
                }
            }

            return { ok: true, value: { mediated, failed }, successType: ['batch-processed'] }
        }
    }

export const _pollValidated = pollValidatedFactory({
    mediateAll,
    safeGenerateId: _safeGenerateId,
    createDispatch: _createDispatch,
    mediateProcessing: _mediateProcessing,
    failProcessing: _failProcessing,
})
