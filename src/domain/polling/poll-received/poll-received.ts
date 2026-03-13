import type { PollReceivedFn } from './poll-received.spec'
import type { ValidationResultEntry } from './steps/classify-validation-results.spec'
import type { DomainDeps } from '../../domain-deps'
import type { ClassifyValidationResultsFn } from './steps/classify-validation-results.spec'
import { classifyValidationResults } from './steps/classify-validation-results'
import { _validateProcessing } from '../../incoming-processing/validate-processing/validate-processing'
import { _failProcessing } from '../../incoming-processing/fail-processing/fail-processing'

type Steps = {
    classifyValidationResults: ClassifyValidationResultsFn['signature']
    validateProcessing: typeof _validateProcessing
    failProcessing: typeof _failProcessing
}

type Deps = {
    findIncomingProcessingsByState: DomainDeps['findIncomingProcessingsByState']
    getIncomingProcessingById: DomainDeps['getIncomingProcessingById']
    resolveSchema: DomainDeps['resolveSchema']
    generateTimestamp: DomainDeps['generateTimestamp']
    upsertIncomingProcessing: DomainDeps['upsertIncomingProcessing']
}

const pollReceivedFactory =
    (steps: Steps) =>
    (deps: Deps): PollReceivedFn['asyncSignature'] => {
        const doValidate = steps.validateProcessing({
            getIncomingProcessingById: deps.getIncomingProcessingById,
            resolveSchema: deps.resolveSchema,
            generateTimestamp: deps.generateTimestamp,
            upsertIncomingProcessing: deps.upsertIncomingProcessing,
        })
        const doFail = steps.failProcessing({
            getIncomingProcessingById: deps.getIncomingProcessingById,
            generateTimestamp: deps.generateTimestamp,
            upsertIncomingProcessing: deps.upsertIncomingProcessing,
        })

        return async (input) => {
            const batchResult = await deps.findIncomingProcessingsByState({ states: ['received'], batchSize: input.batchSize })

            if (batchResult.successType.includes('empty')) {
                return { ok: true, value: { validated: [], failed: [] }, successType: ['empty-batch'] }
            }

            const entries: ValidationResultEntry[] = []

            for (const record of batchResult.value) {
                const result = await doValidate({ cmd: { processingId: record.id } })

                if (result.ok) {
                    entries.push({ processingId: record.id, ok: true })
                } else {
                    await doFail({
                        cmd: { processingId: record.id, reason: result.errors.join(', ') },
                    })
                    entries.push({ processingId: record.id, ok: false, errors: result.errors })
                }
            }

            const classified = steps.classifyValidationResults({ entries })
            if (!classified.ok) return classified as any

            return { ok: true, value: classified.value, successType: ['batch-processed'] }
        }
    }

export const _pollReceived = pollReceivedFactory({
    classifyValidationResults,
    validateProcessing: _validateProcessing,
    failProcessing: _failProcessing,
})
