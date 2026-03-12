import type { PollValidatedFn } from './poll-validated.spec'
import type { ValidatedProcessing, MediationOutcome } from '../../incoming-processing/types'
import type { ActiveMediation, TransformRegistry } from '../../mediation/types'
import type { Result } from '../../shared/spec-framework'
import type { MediatedEntry, MediationFailureEntry } from '../types'
import type { MediateAllFn } from './steps/mediate-all.spec'
import { mediateAll } from './steps/mediate-all'

type Steps = {
    mediateAll: MediateAllFn['signature']
}

type Deps = {
    fetchValidated: (batchSize: number) => Promise<ValidatedProcessing[]>
    findActiveMediationsByTopic: (topic: string) => Promise<ActiveMediation[]>
    getTransformRegistry: () => Promise<TransformRegistry>
    generateDispatchId: () => Promise<string>
    createDispatch: (input: { cmd: { dispatchId: string; processingId: string; mediationId: string; destination: string; event: any } }) => Promise<Result<any, string, string>>
    mediateProcessing: (input: { cmd: { processingId: string; outcomes: MediationOutcome[] } }) => Promise<Result<any, string, string>>
    failProcessing: (input: { cmd: { processingId: string; reason: string } }) => Promise<Result<any, string, string>>
}

const pollValidatedFactory =
    (steps: Steps) =>
    (deps: Deps): PollValidatedFn['asyncSignature'] =>
    async (input) => {
        const batch = await deps.fetchValidated(input.batchSize)

        if (batch.length === 0) {
            return { ok: true, value: { mediated: [], failed: [] }, successType: ['empty-batch'] }
        }

        const mediated: MediatedEntry[] = []
        const failed: MediationFailureEntry[] = []

        for (const record of batch) {
            try {
                const mediations = await deps.findActiveMediationsByTopic(record.topic)
                const registry = await deps.getTransformRegistry()

                const result = steps.mediateAll({
                    event: record.event,
                    mediations,
                    registry,
                })

                if (!result.ok) {
                    throw new Error(result.errors.join(', '))
                }

                const outcomes = result.value
                const dispatches: { dispatchId: string; destination: string }[] = []
                const skipped: string[] = []

                for (const outcome of outcomes) {
                    if (outcome.result === 'dispatched') {
                        const dispatchId = await deps.generateDispatchId()

                        await deps.createDispatch({
                            cmd: {
                                dispatchId,
                                processingId: record.id,
                                mediationId: outcome.mediationId,
                                destination: outcome.destination,
                                event: outcome.event,
                            },
                        })

                        dispatches.push({ dispatchId, destination: outcome.destination })
                    } else {
                        skipped.push(outcome.mediationId)
                    }
                }

                await deps.mediateProcessing({
                    cmd: { processingId: record.id, outcomes },
                })

                mediated.push({ processingId: record.id, dispatches, skipped })
            } catch (err) {
                const reason = err instanceof Error ? err.message : String(err)
                await deps.failProcessing({
                    cmd: { processingId: record.id, reason },
                })
                failed.push({ processingId: record.id, errors: [reason] })
            }
        }

        return { ok: true, value: { mediated, failed }, successType: ['batch-processed'] }
    }

export const pollValidated = pollValidatedFactory({
    mediateAll,
})
